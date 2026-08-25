"use client";

import { useEffect, useMemo, useState } from "react";
import { NewsletterCover } from "./NewsletterCover";
import { DotmCircular7 } from "@/components/ui/dotm-circular-7";
import { newsletterTopics, type NewsletterPost } from "../../lib/newsletter-data";

export type CardPost = Pick<
  NewsletterPost,
  "slug" | "title" | "topic" | "excerpt" | "issue" | "readingMinutes" | "date" | "color" | "label"
>;

function shuffle(list: CardPost[]): CardPost[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function ArchiveGrid({ posts }: { posts: CardPost[] }) {
  const [active, setActive] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<CardPost[]>(posts);

  // Shuffle on the client after mount: keeps SSR and first client render
  // identical (no hydration mismatch) while giving a fresh random mix each
  // visit instead of the topic-grouped seed order.
  useEffect(() => {
    setOrder(shuffle(posts));
  }, [posts]);

  const filtered = useMemo(
    () => (active === "ALL" ? order : order.filter((post) => post.topic === active)),
    [active, order],
  );

  function pick(topic: string) {
    if (topic === active || loading) return;
    setLoading(true);
    // Brief loader, then swap the list in place — no full page navigation.
    window.setTimeout(() => {
      setActive(topic);
      setLoading(false);
    }, 520);
  }

  return (
    <>
      <nav className="mmn-filter" aria-label="Filter posts by topic">
        <button type="button" className={active === "ALL" ? "is-active" : ""} onClick={() => pick("ALL")}>
          All / {posts.length}
        </button>
        {newsletterTopics.map((topic) => (
          <button type="button" key={topic} className={active === topic ? "is-active" : ""} onClick={() => pick(topic)}>
            {topic}
          </button>
        ))}
      </nav>

      <div className="mmn-archive" aria-busy={loading}>
        {loading && (
          <div className="mmn-archive-loader">
            <DotmCircular7 size={34} dotSize={4} speed={1} color="#111111" />
            <span className="mmn-kicker">RENDERING ASCII</span>
          </div>
        )}
        <div className="mmn-grid" data-loading={loading ? "true" : undefined}>
          {filtered.map((post) => (
            <a className="mmn-card" href={`/newsletter/${post.slug}`} key={post.slug}>
              <NewsletterCover post={post} />
              <div className="mmn-card-body">
                <div className="mmn-card-meta mmn-mono">
                  <span>#{String(post.issue).padStart(3, "0")} / {post.topic}</span>
                  <span>{post.readingMinutes} MIN</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="mmn-card-meta mmn-mono">
                  <span>{post.date}</span>
                  <span>READ ↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
