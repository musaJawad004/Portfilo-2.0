import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { Redis } from "@upstash/redis";
import { newsletterPosts, postsForTopics } from "./newsletter-data";

export type Subscriber = {
  id: string;
  email: string;
  topics: string[];
  subscribedAt: string;
  active: boolean;
  viewed: string[];
  lastSentAt?: string;
};

function redis() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

function emailId(email: string) {
  return createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 32);
}

function unsubscribeSecret() {
  return process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || process.env.CRON_SECRET || "";
}

export function unsubscribeToken(email: string) {
  const secret = unsubscribeSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
}

export function validUnsubscribeToken(email: string, token: string) {
  const expected = unsubscribeToken(email);
  if (!expected || !token || expected.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export async function subscribe(email: string, topics: string[]) {
  const store = redis();
  if (!store) throw new Error("Newsletter storage is not configured.");
  const id = emailId(email);
  const existing = await store.get<Subscriber>(`newsletter:subscriber:${id}`);
  const subscriber: Subscriber = {
    id,
    email: email.toLowerCase(),
    topics,
    subscribedAt: existing?.subscribedAt || new Date().toISOString(),
    active: true,
    viewed: existing?.viewed || [],
    lastSentAt: existing?.lastSentAt,
  };
  await store.set(`newsletter:subscriber:${id}`, subscriber);
  await store.sadd("newsletter:subscribers", id);
  return subscriber;
}

export async function recordView(email: string, slug: string) {
  const store = redis();
  if (!store) return;
  const id = emailId(email);
  const subscriber = await store.get<Subscriber>(`newsletter:subscriber:${id}`);
  if (!subscriber) return;
  subscriber.viewed = [...new Set([...(subscriber.viewed || []), slug])].slice(-200);
  await store.set(`newsletter:subscriber:${id}`, subscriber);
}

export async function listSubscribers() {
  const store = redis();
  if (!store) return [];
  const ids = await store.smembers<string[]>("newsletter:subscribers");
  const records = await Promise.all(ids.map((id) => store.get<Subscriber>(`newsletter:subscriber:${id}`)));
  return records.filter((item): item is Subscriber => Boolean(item?.active));
}

export async function unsubscribe(email: string) {
  const store = redis();
  if (!store) throw new Error("Newsletter storage is not configured.");
  const id = emailId(email);
  const subscriber = await store.get<Subscriber>(`newsletter:subscriber:${id}`);
  if (!subscriber) return false;
  subscriber.active = false;
  await store.set(`newsletter:subscriber:${id}`, subscriber);
  return true;
}

export function recommend(subscriber: Subscriber) {
  const candidates = postsForTopics(subscriber.topics, subscriber.viewed);
  if (!candidates.length) return newsletterPosts[0];
  const top = candidates.slice(0, Math.min(5, candidates.length));
  const day = Math.floor(Date.now() / 86_400_000);
  const stable = Number.parseInt(createHash("sha256").update(`${subscriber.id}:${day}`).digest("hex").slice(0, 8), 16);
  return top[stable % top.length];
}

export async function markSent(subscriber: Subscriber, slug: string) {
  const store = redis();
  if (!store) return;
  subscriber.lastSentAt = new Date().toISOString();
  subscriber.viewed = [...new Set([...(subscriber.viewed || []), slug])].slice(-200);
  await store.set(`newsletter:subscriber:${subscriber.id}`, subscriber);
}
