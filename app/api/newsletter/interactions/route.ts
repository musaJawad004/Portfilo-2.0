import { getReaderUser } from "../../../reader-auth";
import { getNewsletterPost } from "../../../../lib/newsletter-data";
import { addComment, getComments, getPostCounts, getReaderState, updateReaderState, updateReadingProgress } from "../../../../lib/newsletter-community";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")?.slice(0, 120) || "";
  if (!getNewsletterPost(slug)) return Response.json({ error: "Post not found." }, { status: 404 });
  const user = await getReaderUser();
  const [comments, counts, state] = await Promise.all([
    getComments(slug), getPostCounts(slug), user ? getReaderState(user.userId) : null,
  ]);
  return Response.json({ comments, counts, signedIn: Boolean(user), liked: state?.liked.includes(slug) || false, saved: state?.saved.includes(slug) || false, progress: state?.progress?.[slug] || 0 });
}

export async function POST(request: Request) {
  const user = await getReaderUser();
  if (!user) return Response.json({ error: "Sign in to continue." }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { action?: unknown; slug?: unknown; comment?: unknown; progress?: unknown };
  const slug = typeof body.slug === "string" ? body.slug.trim().slice(0, 120) : "";
  if (!getNewsletterPost(slug)) return Response.json({ error: "Post not found." }, { status: 404 });
  if (body.action === "comment") {
    const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, 1200) : "";
    if (comment.length < 2) return Response.json({ error: "Write a longer comment." }, { status: 400 });
    return Response.json({ ok: true, comment: await addComment(user.userId, user.displayName, slug, comment) });
  }
  if (body.action === "progress") {
    const progress = typeof body.progress === "number" ? body.progress : Number(body.progress);
    if (!Number.isFinite(progress)) return Response.json({ error: "Invalid progress." }, { status: 400 });
    return Response.json({ ok: true, progress: await updateReadingProgress(user.userId, slug, progress) });
  }
  if (body.action !== "like" && body.action !== "save" && body.action !== "view") return Response.json({ error: "Invalid action." }, { status: 400 });
  const result = await updateReaderState(user.userId, body.action, slug);
  return Response.json({ ok: true, active: result.active });
}
