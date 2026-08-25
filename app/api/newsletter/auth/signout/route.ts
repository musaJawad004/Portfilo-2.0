import { clearedCookie } from "../../../../reader-auth";

function safeReturn(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/newsletter";
  return value.slice(0, 200);
}

function redirect(request: Request): Response {
  const url = new URL(request.url);
  const returnTo = safeReturn(url.searchParams.get("return_to"));
  return new Response(null, {
    status: 302,
    headers: { Location: returnTo, "Set-Cookie": clearedCookie(url.protocol === "https:") },
  });
}

export async function GET(request: Request) {
  return redirect(request);
}
export async function POST(request: Request) {
  return redirect(request);
}
