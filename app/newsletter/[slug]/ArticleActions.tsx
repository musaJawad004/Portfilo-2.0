"use client";

import { useEffect, useState } from "react";

type Comment = { id: string; name: string; body: string; createdAt: string };

export function ArticleActions({ slug, signInHref }: { slug: string; signInHref: string }) {
  const [data, setData] = useState<{ signedIn: boolean; liked: boolean; saved: boolean; progress: number; counts: { likes: number; views: number }; comments: Comment[] } | null>(null);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch(`/api/newsletter/interactions?slug=${encodeURIComponent(slug)}`);
    if (response.ok) setData(await response.json());
  }
  useEffect(() => { load(); }, [slug]);

  async function action(name: "like" | "save") {
    if (!data?.signedIn) { window.location.href = signInHref; return; }
    const response = await fetch("/api/newsletter/interactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: name, slug }) });
    if (response.ok) await load();
  }

  async function submitComment(event: React.FormEvent) {
    event.preventDefault();
    if (!data?.signedIn) { window.location.href = signInHref; return; }
    const response = await fetch("/api/newsletter/interactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "comment", slug, comment }) });
    const payload = await response.json();
    if (!response.ok) { setMessage(payload.error || "Could not post comment."); return; }
    setComment(""); setMessage("Comment published."); await load();
  }

  return <section className="mmn-engagement">
    <div className="mmn-engagement-bar">
      <button className={data?.liked ? "is-active" : ""} onClick={() => action("like")}>♡ LIKE <span>{data?.counts.likes || 0}</span></button>
      <button className={data?.saved ? "is-active" : ""} onClick={() => action("save")}>▱ SAVE</button>
      <span>{data?.counts.views || 0} READS</span>
      {data?.signedIn && <span>{data.progress || 0}% COMPLETE</span>}
    </div>
    <div className="mmn-comments"><span className="mmn-kicker">READER NOTES / {data?.comments.length || 0}</span>
      <form onSubmit={submitComment}><textarea value={comment} onChange={event => setComment(event.target.value)} placeholder="Add a useful note, question, or field experience." maxLength={1200}/><button type="submit">{data?.signedIn ? "[ POST NOTE ]" : "[ SIGN IN TO COMMENT ]"}</button><small>{message}</small></form>
      <div>{data?.comments.map(item => <article key={item.id}><header><strong>{item.name}</strong><time>{new Date(item.createdAt).toLocaleDateString()}</time></header><p>{item.body}</p></article>)}</div>
    </div>
  </section>;
}
