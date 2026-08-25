// One place to send transactional email. Prefers Brevo (free tier, only a
// single verified *sender email* is required — no domain/DNS verification, and
// you can send to any recipient). Falls back to Resend if Brevo is not set.

type SendArgs = { to: string; subject: string; html?: string; text?: string };
type SendResult = { ok: boolean; provider?: "gmail" | "brevo" | "resend"; error?: string };

function parseFrom(raw: string | undefined): { name: string; email: string } | null {
  if (!raw) return null;
  const bracket = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (bracket) return { name: (bracket[1] || "Muhammad Musa Newsletter").trim(), email: bracket[2].trim() };
  if (raw.includes("@")) return { name: "Muhammad Musa Newsletter", email: raw.trim() };
  return null;
}

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<SendResult> {
  // Gmail SMTP: free, uses your own Gmail via an App Password, and sends to any
  // recipient with no domain verification. nodemailer is imported lazily so it
  // is only bundled/loaded when Gmail is actually configured.
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailPass.replace(/\s+/g, "") },
      });
      const fromName = parseFrom(process.env.NEWSLETTER_FROM_EMAIL)?.name || "Muhammad Musa Newsletter";
      await transport.sendMail({
        from: `${fromName} <${gmailUser}>`,
        to,
        subject,
        ...(text ? { text } : {}),
        ...(html ? { html } : {}),
      });
      return { ok: true, provider: "gmail" };
    } catch (error) {
      return { ok: false, provider: "gmail", error: error instanceof Error ? error.message : String(error) };
    }
  }

  const brevoKey = process.env.BREVO_API_KEY;
  const from = parseFrom(
    process.env.NEWSLETTER_FROM_EMAIL || process.env.BREVO_SENDER_EMAIL || process.env.CONTACT_FROM_EMAIL,
  );

  // Brevo: https://developers.brevo.com/reference/sendtransacemail
  if (brevoKey && from) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevoKey, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: from,
        to: [{ email: to }],
        subject,
        ...(html ? { htmlContent: html } : {}),
        ...(text ? { textContent: text } : {}),
      }),
    });
    if (res.ok) return { ok: true, provider: "brevo" };
    return { ok: false, provider: "brevo", error: (await res.text()).slice(0, 300) };
  }

  // Resend fallback.
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resendFrom =
      process.env.NEWSLETTER_FROM_EMAIL ||
      process.env.CONTACT_FROM_EMAIL ||
      "Muhammad Musa Newsletter <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: resendFrom, to: [to], subject, ...(html ? { html } : {}), ...(text ? { text } : {}) }),
    });
    if (res.ok) return { ok: true, provider: "resend" };
    return { ok: false, provider: "resend", error: (await res.text()).slice(0, 300) };
  }

  return { ok: false, error: "no email provider configured (set BREVO_API_KEY or RESEND_API_KEY)" };
}
