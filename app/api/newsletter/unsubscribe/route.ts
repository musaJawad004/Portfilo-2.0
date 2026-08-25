import { unsubscribe, validUnsubscribeToken } from "../../../../lib/newsletter";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const token = url.searchParams.get("token") || "";

  if (!email || !validUnsubscribeToken(email, token)) {
    return new Response("This unsubscribe link is invalid or expired.", { status: 400 });
  }

  try {
    await unsubscribe(email);
    return new Response("You are unsubscribed from Muhammad Musa Newsletter.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response("Newsletter storage is unavailable. Please try again.", { status: 503 });
  }
}
