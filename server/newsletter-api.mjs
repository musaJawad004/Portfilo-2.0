import { createHash } from "node:crypto";
import express from "express";
import { Redis } from "@upstash/redis";

const app = express();
const port = Number(process.env.NEWSLETTER_API_PORT || 8787);
const allowedOrigin = process.env.NEWSLETTER_PUBLIC_URL || "http://localhost:3000";
const topics = new Set(["Agents", "RAG", "Models", "Mobile", "Backend", "Cloud", "Developer Tools", "AI Research"]);
const attempts = new Map();

app.disable("x-powered-by");
app.use(express.json({ limit: "24kb" }));
app.use((request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  if (request.headers.origin === allowedOrigin) response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  next();
});
app.use((request, response, next) => {
  const key = request.ip || "unknown";
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < 60_000);
  if (recent.length >= 20) return response.status(429).json({ ok: false, message: "Please slow down." });
  recent.push(now);
  attempts.set(key, recent);
  next();
});

function store() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

function subscriberId(email) {
  return createHash("sha256").update(email).digest("hex").slice(0, 32);
}

app.get("/health", (_request, response) => response.json({ ok: true, service: "mm-newsletter" }));

app.post("/v1/subscribers", async (request, response) => {
  const email = String(request.body?.email || "").trim().toLowerCase();
  const selectedTopics = Array.isArray(request.body?.topics) ? request.body.topics.filter((topic) => topics.has(topic)) : [];
  if (request.body?.website) return response.status(202).json({ ok: true });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response.status(400).json({ ok: false, message: "Enter a valid email address." });
  const redis = store();
  if (!redis) return response.status(503).json({ ok: false, message: "Newsletter storage is not configured." });

  const id = subscriberId(email);
  const key = `newsletter:subscriber:${id}`;
  const existing = await redis.get(key);
  const subscriber = {
    id,
    email,
    topics: selectedTopics.length ? selectedTopics : ["Agents", "RAG", "Developer Tools"],
    subscribedAt: existing?.subscribedAt || new Date().toISOString(),
    active: true,
    viewed: existing?.viewed || [],
    lastSentAt: existing?.lastSentAt,
  };
  await redis.set(key, subscriber);
  await redis.sadd("newsletter:subscribers", id);
  return response.status(existing ? 200 : 201).json({ ok: true, message: "Your daily signal is ready." });
});

app.post("/v1/views", async (request, response) => {
  const email = String(request.body?.email || "").trim().toLowerCase();
  const slug = String(request.body?.slug || "").trim();
  if (!email || !slug) return response.status(400).json({ ok: false });
  const redis = store();
  if (!redis) return response.status(503).json({ ok: false });
  const id = subscriberId(email);
  const key = `newsletter:subscriber:${id}`;
  const subscriber = await redis.get(key);
  if (subscriber) {
    subscriber.viewed = [...new Set([...(subscriber.viewed || []), slug])].slice(-200);
    await redis.set(key, subscriber);
  }
  return response.status(202).json({ ok: true });
});

app.use((_request, response) => response.status(404).json({ ok: false }));
// Express identifies error middleware by its four-argument signature.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, _request, response, _next) => {
  console.error("newsletter-api", error instanceof Error ? error.message : "unknown error");
  response.status(500).json({ ok: false, message: "Unexpected server error." });
});

app.listen(port, () => console.log(`Muhammad Musa Newsletter API listening on ${port}`));
