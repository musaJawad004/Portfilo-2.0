import { Redis } from "@upstash/redis";
import { newsletterPosts, postsForTopics, type NewsletterTopic } from "./newsletter-data";

export type ReaderState = {
  liked: string[];
  saved: string[];
  viewed: string[];
  topics: string[];
  progress: Record<string, number>;
};

export type ReaderComment = {
  id: string;
  slug: string;
  userId: string;
  name: string;
  body: string;
  createdAt: string;
};

export type CommunityPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  topic: NewsletterTopic;
  authorId: string;
  authorName: string;
  createdAt: string;
};

function store() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

const emptyReader = (): ReaderState => ({ liked: [], saved: [], viewed: [], topics: [], progress: {} });

export async function getReaderState(userId: string): Promise<ReaderState> {
  const db = store();
  if (!db) return emptyReader();
  const saved = await db.get<ReaderState>(`newsletter:reader:${userId}`);
  return saved ? { ...emptyReader(), ...saved, progress: saved.progress || {} } : emptyReader();
}

export async function updateReadingProgress(userId: string, slug: string, progress: number) {
  const db = store();
  if (!db) throw new Error("Newsletter storage is not configured.");
  const state = await getReaderState(userId);
  state.progress[slug] = Math.max(state.progress[slug] || 0, Math.min(100, Math.round(progress)));
  await db.set(`newsletter:reader:${userId}`, state);
  return state.progress[slug];
}

export async function updateReaderState(userId: string, action: "like" | "save" | "view", slug: string) {
  const db = store();
  if (!db) throw new Error("Newsletter storage is not configured.");
  const state = await getReaderState(userId);
  const key = action === "like" ? "liked" : action === "save" ? "saved" : "viewed";
  const current = state[key];
  const active = action === "view" || !current.includes(slug);
  state[key] = action === "view"
    ? [...new Set([...current, slug])].slice(-300)
    : active ? [...current, slug] : current.filter(item => item !== slug);
  const post = newsletterPosts.find(item => item.slug === slug);
  if (post) state.topics = [...new Set([post.topic, ...state.topics])].slice(0, 8);
  await db.set(`newsletter:reader:${userId}`, state);
  if (action === "view") await db.zincrby("newsletter:views", 1, slug);
  if (action === "like") await db.zincrby("newsletter:likes", active ? 1 : -1, slug);
  return { state, active };
}

export async function addComment(userId: string, name: string, slug: string, body: string) {
  const db = store();
  if (!db) throw new Error("Newsletter storage is not configured.");
  const comment: ReaderComment = { id: crypto.randomUUID(), slug, userId, name, body, createdAt: new Date().toISOString() };
  await db.lpush(`newsletter:comments:${slug}`, comment);
  await db.ltrim(`newsletter:comments:${slug}`, 0, 99);
  return comment;
}

export async function getComments(slug: string): Promise<ReaderComment[]> {
  const db = store();
  if (!db) return [];
  return db.lrange<ReaderComment>(`newsletter:comments:${slug}`, 0, 99);
}

export async function getPostCounts(slug: string) {
  const db = store();
  if (!db) return { likes: 0, views: 0 };
  const [likes, views] = await Promise.all([db.zscore("newsletter:likes", slug), db.zscore("newsletter:views", slug)]);
  return { likes: Number(likes || 0), views: Number(views || 0) };
}

export async function getPopularSlugs() {
  const db = store();
  if (!db) return [];
  return db.zrange<string[]>("newsletter:views", 0, 7, { rev: true });
}

export async function recommendedFor(userId: string) {
  const state = await getReaderState(userId);
  return postsForTopics(state.topics, state.viewed).slice(0, 6);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72);
}

export async function publishCommunityPost(input: Omit<CommunityPost, "slug" | "createdAt">) {
  const db = store();
  if (!db) throw new Error("Newsletter storage is not configured.");
  const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;
  const post: CommunityPost = { ...input, slug, createdAt: new Date().toISOString() };
  await db.set(`newsletter:community:${slug}`, post);
  await db.lpush("newsletter:community:index", slug);
  await db.ltrim("newsletter:community:index", 0, 199);
  return post;
}

export async function getCommunityPost(slug: string) {
  const db = store();
  return db ? db.get<CommunityPost>(`newsletter:community:${slug}`) : null;
}

export async function listCommunityPosts(limit = 6): Promise<CommunityPost[]> {
  const db = store();
  if (!db) return [];
  const slugs = await db.lrange<string>("newsletter:community:index", 0, Math.max(0, limit - 1));
  const posts = await Promise.all(slugs.map(slug => getCommunityPost(slug)));
  return posts.filter((post): post is CommunityPost => Boolean(post));
}
