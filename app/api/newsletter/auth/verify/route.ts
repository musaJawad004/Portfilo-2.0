import { createSessionValue, sessionCookie, verifyMagicToken } from "../../../../reader-auth";

function safeReturn(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/newsletter";
  return value.slice(0, 200);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const returnTo = safeReturn(url.searchParams.get("return_to"));
  const secure = url.protocol === "https:";

  const email = verifyMagicToken(token);
  if (!email) {
    return new Response(null, {
      status: 302,
      headers: { Location: `/newsletter?signin=expired` },
    });
  }

  const cookie = sessionCookie(createSessionValue(email), secure);
  return new Response(null, {
    status: 302,
    headers: { Location: returnTo, "Set-Cookie": cookie },
  });
}
