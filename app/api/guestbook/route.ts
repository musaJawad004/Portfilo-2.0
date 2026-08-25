import {
  createPendingGuestbookEntry,
  removePendingGuestbookEntry,
} from "../../../lib/guestbook";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GUESTBOOK_RECIPIENT = "musajawad004@gmail.com";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanLine(value: unknown, maxLength: number) {
  return clean(value, maxLength).replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = cleanLine(body.name, 60);
    const email = cleanLine(body.email, 160);
    const message = clean(body.message, 280);
    const website = clean(body.website, 200);

    if (website) return Response.json({ ok: true, message: "Note received." });

    if (name.length < 2 || message.length < 8 || (email && !EMAIL_PATTERN.test(email))) {
      return Response.json(
        { ok: false, message: "Please add your name, a short note, and a valid email if supplied." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Muhammad Musa Portfolio <onboarding@resend.dev>";

    if (!apiKey) {
      return Response.json(
        { ok: false, message: "Guestbook delivery is not configured yet." },
        { status: 503 },
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email || "Not provided");
    const safeMessage = escapeHtml(message);
    const submittedAt = new Date().toISOString();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
    const pending = await createPendingGuestbookEntry({ name, email, message, submittedAt });
    const actionUrl = (action: "approve" | "reject") => {
      const url = new URL("/api/guestbook/moderate", siteUrl);
      url.searchParams.set("action", action);
      url.searchParams.set("id", pending.id);
      url.searchParams.set("token", pending.token);
      return url.toString();
    };
    const approveUrl = actionUrl("approve");
    const rejectUrl = actionUrl("reject");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [GUESTBOOK_RECIPIENT],
        ...(email ? { reply_to: email } : {}),
        subject: `[GUESTBOOK REVIEW] ${name} left a note`,
        text: [
          "NEW GUESTBOOK NOTE",
          "",
          `Name: ${name}`,
          `Email: ${email || "Not provided"}`,
          `Submitted: ${submittedAt}`,
          "",
          message,
          "",
          "This note has not been published automatically.",
          "",
          `APPROVE: ${approveUrl}`,
          `REJECT: ${rejectUrl}`,
        ].join("\n"),
        html: `
          <div style="background:#f4f4f0;padding:32px 16px;font-family:Arial,sans-serif;color:#151515">
            <div style="max-width:680px;margin:auto;border:1px solid #d0d0c9;background:#fff">
              <div style="background:#151515;color:#fff;padding:18px 24px;font-family:monospace;letter-spacing:.12em">GUESTBOOK / REVIEW QUEUE</div>
              <div style="padding:28px 24px">
                <p style="margin:0;color:#777;font-family:monospace;font-size:12px">FROM</p>
                <h1 style="margin:8px 0 22px;font-size:30px">${safeName}</h1>
                <p style="margin:0 0 24px;color:#777">${safeEmail} · ${submittedAt}</p>
                <div style="padding:22px;border:1px solid #d0d0c9;white-space:pre-wrap;font-size:18px;line-height:1.6">${safeMessage}</div>
                <div style="display:flex;gap:12px;margin-top:24px">
                  <a href="${approveUrl}" style="display:inline-block;background:#151515;color:#fff;padding:15px 22px;text-decoration:none;font-family:monospace;font-size:12px;font-weight:700;letter-spacing:.08em">[ APPROVE ]</a>
                  <a href="${rejectUrl}" style="display:inline-block;border:1px solid #151515;color:#151515;padding:14px 22px;text-decoration:none;font-family:monospace;font-size:12px;font-weight:700;letter-spacing:.08em">[ REJECT ]</a>
                </div>
                <p style="margin:22px 0 0;color:#777;font-family:monospace;font-size:11px">SECURE ONE-TIME LINKS / EXPIRE AFTER 30 DAYS</p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      await removePendingGuestbookEntry(pending.id);
      return Response.json({ ok: false, message: "Your note could not be delivered. Please try again." }, { status: 502 });
    }

    return Response.json({ ok: true, message: "Note received and queued for review." });
  } catch {
    return Response.json({ ok: false, message: "Your note could not be processed." }, { status: 400 });
  }
}
