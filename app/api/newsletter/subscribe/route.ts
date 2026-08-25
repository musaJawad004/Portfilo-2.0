import { newsletterTopics } from "../../../../lib/newsletter-data";
import { subscribe } from "../../../../lib/newsletter";
import { sendEmail } from "../../../../lib/email";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendWelcome(email: string, origin: string) {
  const home = `${origin}/newsletter`;

  const text = [
    "Welcome to the Muhammad Musa Newsletter.",
    "",
    "You'll get one researched field note, most days: AI engineering, RAG, agents, models, mobile, and backend systems, with the architecture choices and failure modes that matter in production.",
    "",
    `Start reading: ${home}`,
    "",
    "Every issue is researched from primary sources. No sponsored links.",
  ].join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#111">
    <p style="font:700 11px monospace;letter-spacing:.1em;text-transform:uppercase;color:#666">Muhammad Musa Newsletter</p>
    <h1 style="font-size:26px;margin:8px 0 14px">You're in.</h1>
    <p style="font-size:15px;line-height:1.65;color:#333">You'll get one researched field note, most days: AI engineering, RAG, agents, models, mobile, and backend systems, with the architecture choices and failure modes that matter in production.</p>
    <p style="margin:22px 0"><a href="${home}" style="background:#111;color:#fff;text-decoration:none;padding:14px 20px;font:700 12px monospace;letter-spacing:.06em;display:inline-block">START READING &rarr;</a></p>
    <p style="font-size:12px;color:#888;line-height:1.6">Every issue is researched from primary sources. No sponsored links.</p>
  </div>`;

  await sendEmail({ to: email, subject: "Welcome to the Muhammad Musa Newsletter", text, html });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown; topics?: unknown; website?: unknown };
    if (body.website) return Response.json({ ok: true });

    const email = typeof body.email === "string" ? body.email.trim().slice(0, 160) : "";
    if (!EMAIL.test(email)) {
      return Response.json({ ok: false, message: "Add a valid email address." }, { status: 400 });
    }

    const allowed = new Set<string>(newsletterTopics);
    let topics = Array.isArray(body.topics)
      ? body.topics.filter((topic): topic is string => typeof topic === "string" && allowed.has(topic)).slice(0, 8)
      : [];
    // No "choose your signal" step, so default to a random spread if none sent.
    if (!topics.length) topics = [...newsletterTopics].sort(() => Math.random() - 0.5).slice(0, 3);

    await subscribe(email, topics);

    const origin = (process.env.NEWSLETTER_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
    try {
      await sendWelcome(email, origin);
    } catch {
      // welcome email is best-effort; never fail the subscription on it
    }

    return Response.json({ ok: true, message: "You're subscribed. Check your inbox for a welcome note." });
  } catch {
    return Response.json({ ok: false, message: "Subscription storage is not configured yet." }, { status: 503 });
  }
}
