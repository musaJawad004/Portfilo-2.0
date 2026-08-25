import { getNewsletterPost } from "../../../../lib/newsletter-data";
import { recordView } from "../../../../lib/newsletter";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: unknown; slug?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 160) : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().slice(0, 120) : "";
  if (email && getNewsletterPost(slug)) await recordView(email, slug);
  return Response.json({ ok: true });
}
