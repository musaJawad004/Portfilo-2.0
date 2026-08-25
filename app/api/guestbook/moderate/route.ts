import { moderateGuestbookEntry } from "../../../../lib/guestbook";

type ModerationAction = "approve" | "reject";

function moderationPage(title: string, message: string, status = 200) {
  const body = `<!doctype html>
    <html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex,nofollow" /><title>${title} | Muhammad Musa</title>
    <style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f4f0;color:#151515;font-family:Arial,sans-serif;padding:24px}.shell{width:min(680px,100%);border:1px solid #cecec7;background:#fff}.bar{padding:18px 24px;background:#151515;color:#fff;font:700 13px/1.3 monospace;letter-spacing:.12em}.content{padding:clamp(32px,7vw,72px)}.index{font:700 12px/1 monospace;color:#8b8b86;letter-spacing:.12em}h1{font-size:clamp(40px,8vw,72px);line-height:.95;margin:18px 0 24px}p{color:#666;font-size:18px;line-height:1.6;margin:0 0 30px}a{display:inline-block;border:1px solid #151515;padding:16px 22px;color:#151515;text-decoration:none;font:700 12px/1 monospace;letter-spacing:.1em}a:hover{background:#151515;color:#fff}</style></head>
    <body><main class="shell"><div class="bar">GUESTBOOK / MODERATION</div><div class="content"><span class="index">ACTION COMPLETE</span><h1>${title}</h1><p>${message}</p><a href="/guestbook">VIEW GUESTBOOK ↗</a></div></main></body></html>`;
  return new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

function confirmationPage(id: string, token: string, action: ModerationAction) {
  const verb = action === "approve" ? "Approve" : "Reject";
  const detail = action === "approve"
    ? "Publish this note on the public Guestbook? The sender's email will remain private."
    : "Remove this note permanently? It will not appear on the public Guestbook.";
  const body = `<!doctype html>
    <html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex,nofollow" /><title>${verb} note | Muhammad Musa</title>
    <style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f4f0;color:#151515;font-family:Arial,sans-serif;padding:24px}.shell{width:min(680px,100%);border:1px solid #cecec7;background:#fff}.bar{padding:18px 24px;background:#151515;color:#fff;font:700 13px/1.3 monospace;letter-spacing:.12em}.content{padding:clamp(32px,7vw,72px)}.index{font:700 12px/1 monospace;color:#8b8b86;letter-spacing:.12em}h1{font-size:clamp(40px,8vw,72px);line-height:.95;margin:18px 0 24px}p{color:#666;font-size:18px;line-height:1.6;margin:0 0 30px}.actions{display:flex;gap:12px;flex-wrap:wrap}button,a{display:inline-block;border:1px solid #151515;padding:16px 22px;text-decoration:none;font:700 12px/1 monospace;letter-spacing:.1em;cursor:pointer}button{background:#151515;color:#fff}a{background:#fff;color:#151515}button:hover,a:hover{filter:invert(1)}</style></head>
    <body><main class="shell"><div class="bar">GUESTBOOK / MODERATION</div><div class="content"><span class="index">CONFIRM ACTION</span><h1>${verb} note?</h1><p>${detail}</p><div class="actions"><form method="post"><input type="hidden" name="id" value="${id}" /><input type="hidden" name="token" value="${token}" /><input type="hidden" name="action" value="${action}" /><button type="submit">[ CONFIRM ${action.toUpperCase()} ]</button></form><a href="/guestbook">CANCEL</a></div></div></main></body></html>`;
  return new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

function isValidInput(id: string, token: string, action: string | null): action is ModerationAction {
  return /^[0-9a-f-]{36}$/i.test(id)
    && /^[A-Za-z0-9_-]{32,128}$/.test(token)
    && (action === "approve" || action === "reject");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  const token = url.searchParams.get("token") || "";
  const action = url.searchParams.get("action");

  if (!isValidInput(id, token, action)) {
    return moderationPage("Invalid link.", "This moderation link is incomplete.", 400);
  }

  return confirmationPage(id, token, action);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const id = String(form.get("id") || "");
  const token = String(form.get("token") || "");
  const action = form.get("action") ? String(form.get("action")) : null;

  if (!isValidInput(id, token, action)) {
    return moderationPage("Invalid request.", "This moderation request is incomplete.", 400);
  }

  const result = await moderateGuestbookEntry(id, token, action);
  if (!result.ok) {
    const message = result.reason === "missing"
      ? "This note was already reviewed or the link has expired."
      : "This moderation link is invalid or Guestbook storage is unavailable.";
    return moderationPage("Nothing to review.", message, result.reason === "missing" ? 410 : 400);
  }

  return action === "approve"
    ? moderationPage("Note approved.", "The note is now published on your public Guestbook.")
    : moderationPage("Note rejected.", "The note was removed and will not appear publicly.");
}
