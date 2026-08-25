import { getReaderUser } from "../../../reader-auth";
import { newsletterTopics, type NewsletterTopic } from "../../../../lib/newsletter-data";
import { listCommunityPosts, publishCommunityPost } from "../../../../lib/newsletter-community";

export async function GET() {
  return Response.json({ posts: await listCommunityPosts(30) });
}

export async function POST(request: Request) {
  const user = await getReaderUser();
  if (!user) return Response.json({ error: "Sign in to publish." }, { status: 401 });
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 140) : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim().slice(0, 280) : "";
  const content = typeof body.body === "string" ? body.body.trim().slice(0, 20000) : "";
  const topic = typeof body.topic === "string" && newsletterTopics.includes(body.topic as NewsletterTopic) ? body.topic as NewsletterTopic : "AI Research";
  if (title.length < 8 || excerpt.length < 20 || content.length < 120) return Response.json({ error: "Add a clear title, summary, and at least 120 characters of useful content." }, { status: 400 });
  const post = await publishCommunityPost({ title, excerpt, body: content, topic, authorId: user.userId, authorName: user.displayName });
  return Response.json({ ok: true, post });
}
