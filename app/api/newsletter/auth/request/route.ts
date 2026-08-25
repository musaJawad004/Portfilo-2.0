import { authConfigured, createMagicToken, isEmail } from "../../../../reader-auth";
import { sendEmail } from "../../../../../lib/email";

function originFrom(request: Request): string {
  const site = process.env.NEWSLETTER_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (site) return site.replace(/\/$/, "");
  return new URL(request.url).origin;
}

function safeReturn(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/newsletter";
  return value.slice(0, 200);
}

export async function POST(request: Request) {
  if (!authConfigured()) {
    return Response.json({ ok: false, message: "Sign-in is not configured on this deployment yet." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as { email?: unknown; returnTo?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const returnTo = safeReturn(typeof body.returnTo === "string" ? body.returnTo : null);

  if (!isEmail(email)) {
    return Response.json({ ok: false, message: "Enter a valid email address." }, { status: 400 });
  }

  const token = createMagicToken(email);
  const link = `${originFrom(request)}/api/newsletter/auth/verify?token=${encodeURIComponent(token)}&return_to=${encodeURIComponent(returnTo)}`;

  const text = [
    "Sign in to the Muhammad Musa Newsletter.",
    "",
    "Click the link below to sign in. It expires in 15 minutes and works once from this device:",
    link,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#111">
    <p style="font:700 11px monospace;letter-spacing:.1em;text-transform:uppercase;color:#666">Muhammad Musa Newsletter</p>
    <h1 style="font-size:26px;margin:8px 0 14px">Sign in link</h1>
    <p style="font-size:15px;line-height:1.6;color:#333">Click the button to sign in. This link expires in 15 minutes.</p>
    <p style="margin:22px 0"><a href="${link}" style="background:#111;color:#fff;text-decoration:none;padding:14px 20px;font:700 12px monospace;letter-spacing:.06em;display:inline-block">SIGN IN &rarr;</a></p>
    <p style="font-size:12px;color:#888;line-height:1.6">If the button does not work, paste this URL into your browser:<br>${link}</p>
    <p style="font-size:12px;color:#888">If you did not request this, ignore this email.</p>
  </div>`;

  const result = await sendEmail({ to: email, subject: "Your newsletter sign-in link", text, html });
  if (!result.ok) {
    return Response.json({ ok: false, message: "Could not send the sign-in email. Try again shortly." }, { status: 502 });
  }

  return Response.json({ ok: true, message: "Check your inbox for the sign-in link." });
}
