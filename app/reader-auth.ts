import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getChatGPTUser, type ChatGPTUser } from "./chatgpt-auth";

// Stateless email magic-link auth. A signed, short-lived token is emailed to the
// reader; clicking it sets a signed session cookie. No database is required for
// either the link or the session — everything is HMAC-signed with a server
// secret. Reader identity is the same shape as the ChatGPT runtime user, so the
// two coexist (cookie session wins; ChatGPT headers are the fallback).

const COOKIE = "mmn_session";
const MAGIC_TTL_MS = 1000 * 60 * 15; // 15 minutes
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  return (
    process.env.NEWSLETTER_SESSION_SECRET ||
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ||
    process.env.CRON_SECRET ||
    process.env.KV_REST_API_TOKEN ||
    process.env.RESEND_API_KEY ||
    ""
  );
}

export function authConfigured(): boolean {
  return Boolean(secret());
}

export function emailId(email: string): string {
  return createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 32);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value) && value.length <= 160 && !value.includes("|");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function makeToken(purpose: "magic" | "session", email: string, ttlMs: number): string {
  const payload = `${purpose}|${email.toLowerCase()}|${Date.now() + ttlMs}`;
  const token = `${payload}|${sign(payload)}`;
  return Buffer.from(token).toString("base64url");
}

function readToken(purpose: "magic" | "session", raw: string | undefined): string | null {
  if (!raw || !secret()) return null;
  let decoded: string;
  try {
    decoded = Buffer.from(raw, "base64url").toString();
  } catch {
    return null;
  }
  const parts = decoded.split("|");
  if (parts.length !== 4) return null;
  const [tokenPurpose, email, expStr, sig] = parts;
  if (tokenPurpose !== purpose) return null;
  const payload = `${tokenPurpose}|${email}|${expStr}`;
  const expected = sign(payload);
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  if (!Number.isFinite(Number(expStr)) || Number(expStr) < Date.now()) return null;
  if (!isEmail(email)) return null;
  return email;
}

export function createMagicToken(email: string): string {
  return makeToken("magic", email, MAGIC_TTL_MS);
}
export function verifyMagicToken(token: string | undefined): string | null {
  return readToken("magic", token);
}
export function createSessionValue(email: string): string {
  return makeToken("session", email, SESSION_TTL_MS);
}

export function sessionCookie(value: string, secure: boolean): string {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}
export function clearedCookie(secure: boolean): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}

function userFromEmail(email: string): ChatGPTUser {
  return { userId: emailId(email), displayName: email, email, fullName: null };
}

// Unified reader identity used across the newsletter.
export async function getReaderUser(): Promise<ChatGPTUser | null> {
  const store = await cookies();
  const email = readToken("session", store.get(COOKIE)?.value);
  if (email) return userFromEmail(email);
  return getChatGPTUser();
}
