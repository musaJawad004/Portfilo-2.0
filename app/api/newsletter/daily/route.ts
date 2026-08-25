import { listSubscribers, markSent, recommend, unsubscribeToken } from "../../../../lib/newsletter";

function emailHtml(origin: string, email: string, post: ReturnType<typeof recommend>) {
  const token = unsubscribeToken(email);
  const unsubscribe = `${origin}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
  return `<div style="background:#f3f2ed;padding:32px;font-family:Arial,sans-serif;color:#111"><div style="max-width:680px;margin:auto;border:1px solid #c9c8c1;background:#fff"><div style="padding:18px 24px;background:#111;color:#fff;font-family:monospace;letter-spacing:.12em">MUHAMMAD MUSA / NEWSLETTER</div><div style="padding:32px"><p style="font-family:monospace;color:#777">ISSUE ${String(post.issue).padStart(3, "0")} / ${post.topic.toUpperCase()}</p><h1 style="font-size:38px;line-height:1.05">${post.title}</h1><p style="font-size:18px;line-height:1.6;color:#555">${post.excerpt}</p><a href="${origin}/newsletter/${post.slug}" style="display:inline-block;margin-top:16px;background:#111;color:#fff;padding:14px 18px;text-decoration:none;font-family:monospace">[ READ THE ISSUE ]</a><p style="margin-top:32px;font-size:12px;color:#777">Selected from your interests. Read issues are excluded from future recommendations. <a href="${unsubscribe}" style="color:#555">Unsubscribe</a></p></div></div></div>`;
}

async function run(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return Response.json({ ok: false, message: "Email is not configured." }, { status: 503 });
  const origin = (process.env.NEWSLETTER_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  const from = process.env.NEWSLETTER_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || "Muhammad Musa Newsletter <onboarding@resend.dev>";
  const subscribers = await listSubscribers();
  let sent = 0;
  for (const subscriber of subscribers) {
    const post = recommend(subscriber);
    const deliveryKey = `mm-newsletter-${subscriber.id}-${post.slug}-${new Date().toISOString().slice(0, 10)}`;
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": deliveryKey }, body: JSON.stringify({ from, to: [subscriber.email], subject: `${post.title} | Muhammad Musa Newsletter`, html: emailHtml(origin, subscriber.email, post) }) });
    if (response.ok) { await markSent(subscriber, post.slug); sent += 1; }
  }
  return Response.json({ ok: true, sent });
}

export const GET = run;
export const POST = run;
