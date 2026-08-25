import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

import { Redis } from "@upstash/redis";

const APPROVED_INDEX = "guestbook:approved";
const PENDING_TTL_SECONDS = 60 * 60 * 24 * 30;

export type GuestbookApprovedEntry = {
  id: string;
  name: string;
  message: string;
  submittedAt: string;
  approvedAt: string;
};

type GuestbookPendingEntry = {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  tokenHash: string;
};

function getRedis() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

function pendingKey(id: string) {
  return `guestbook:pending:${id}`;
}

function approvedKey(id: string) {
  return `guestbook:approved:${id}`;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function tokensMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function createPendingGuestbookEntry(input: {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}) {
  const redis = getRedis();
  if (!redis) throw new Error("Guestbook storage is not configured.");

  const id = randomUUID();
  const token = randomBytes(32).toString("base64url");
  const entry: GuestbookPendingEntry = {
    id,
    ...input,
    tokenHash: hashToken(token),
  };

  await redis.set(pendingKey(id), entry, { ex: PENDING_TTL_SECONDS });
  return { id, token };
}

export async function removePendingGuestbookEntry(id: string) {
  const redis = getRedis();
  if (redis) await redis.del(pendingKey(id));
}

export async function moderateGuestbookEntry(
  id: string,
  token: string,
  action: "approve" | "reject",
) {
  const redis = getRedis();
  if (!redis) return { ok: false as const, reason: "storage" as const };

  const pending = await redis.get<GuestbookPendingEntry>(pendingKey(id));
  if (!pending) return { ok: false as const, reason: "missing" as const };
  if (!tokensMatch(hashToken(token), pending.tokenHash)) {
    return { ok: false as const, reason: "invalid" as const };
  }

  if (action === "approve") {
    const approved: GuestbookApprovedEntry = {
      id: pending.id,
      name: pending.name,
      message: pending.message,
      submittedAt: pending.submittedAt,
      approvedAt: new Date().toISOString(),
    };
    await redis.set(approvedKey(id), approved);
    await redis.zadd(APPROVED_INDEX, { score: Date.parse(approved.approvedAt), member: id });
  }

  await redis.del(pendingKey(id));
  return { ok: true as const, action };
}

export async function listApprovedGuestbookEntries() {
  const redis = getRedis();
  if (!redis) return [];

  try {
    const ids = await redis.zrange<string[]>(APPROVED_INDEX, 0, 23, { rev: true });
    const entries = await Promise.all(
      ids.map((id) => redis.get<GuestbookApprovedEntry>(approvedKey(id))),
    );
    return entries.filter((entry): entry is GuestbookApprovedEntry => Boolean(entry));
  } catch {
    return [];
  }
}
