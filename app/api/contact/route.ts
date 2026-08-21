const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_RECIPIENT = "musajawad004@gmail.com";

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
    const name = cleanLine(body.name, 80);
    const email = cleanLine(body.email, 160);
    const message = clean(body.message, 3000);
    const website = clean(body.website, 200);

    if (website) return Response.json({ ok: true, message: "Message received." });

    if (name.length < 2 || !EMAIL_PATTERN.test(email) || message.length < 20) {
      return Response.json(
        { ok: false, message: "Please complete your name, email, and project details." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Muhammad Musa Portfolio <onboarding@resend.dev>";

    if (!apiKey) {
      return Response.json(
        { ok: false, message: "Contact email is not configured yet. Please use Book a Call." },
        { status: 503 },
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const submittedAt = new Date().toISOString();
    const subject = `[PORTFOLIO LEAD] ${name} - New project inquiry`;
    const text = [
      "NEW PORTFOLIO PROJECT INQUIRY",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Submitted: ${submittedAt}`,
      "Source: Muhammad Musa Portfolio",
      "",
      "PROJECT BRIEF",
      message,
      "",
      `Reply directly to ${email}.`,
    ].join("\n");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [CONTACT_RECIPIENT],
        reply_to: email,
        subject,
        text,
        html: `
          <div style="background:#f4f4f0;padding:32px 16px;font-family:Arial,sans-serif;color:#151515">
            <div style="max-width:680px;margin:auto;border:1px solid #d0d0c9;background:#fff">
              <div style="background:#151515;color:#fff;padding:18px 24px;font-family:monospace;letter-spacing:.14em;font-size:13px">
                NEW PORTFOLIO PROJECT INQUIRY
              </div>
              <div style="padding:28px 24px">
                <p style="margin:0 0 8px;color:#777;font-family:monospace;font-size:12px;letter-spacing:.12em">PROSPECT</p>
                <h1 style="margin:0 0 24px;font-size:30px;line-height:1.2">${safeName}</h1>
                <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:15px">
                  <tr>
                    <td style="padding:12px 0;border-top:1px solid #d0d0c9;color:#777;width:120px">Email</td>
                    <td style="padding:12px 0;border-top:1px solid #d0d0c9"><a href="mailto:${safeEmail}" style="color:#151515">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-top:1px solid #d0d0c9;color:#777">Submitted</td>
                    <td style="padding:12px 0;border-top:1px solid #d0d0c9">${submittedAt}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-top:1px solid #d0d0c9;color:#777">Source</td>
                    <td style="padding:12px 0;border-top:1px solid #d0d0c9">Muhammad Musa Portfolio</td>
                  </tr>
                </table>
                <p style="margin:0 0 10px;color:#777;font-family:monospace;font-size:12px;letter-spacing:.12em">PROJECT BRIEF</p>
                <div style="white-space:pre-wrap;line-height:1.75;font-size:16px">${safeMessage}</div>
                <div style="margin-top:28px;padding-top:20px;border-top:1px solid #d0d0c9">
                  <a href="mailto:${safeEmail}" style="display:inline-block;background:#151515;color:#fff;text-decoration:none;padding:13px 18px;font-family:monospace;font-size:13px;letter-spacing:.08em">REPLY TO LEAD</a>
                </div>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      return Response.json(
        { ok: false, message: "Email delivery failed. Please try again or use Book a Call." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, message: "Message sent." });
  } catch {
    return Response.json(
      { ok: false, message: "The message could not be processed." },
      { status: 400 },
    );
  }
}
