"use client";

import { useState } from "react";
import { newsletterTopics } from "../../../lib/newsletter-data";

export function NewsletterWriteForm({ author }: { author: string }) {
  const [status, setStatus] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Publishing...");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const payload = await response.json();
    if (!response.ok) { setStatus(payload.error || "Could not publish."); return; }
    window.location.href = `/newsletter/community/${payload.post.slug}`;
  }
  return <form className="mmn-write-form" onSubmit={submit}><div className="mmn-write-meta"><span>AUTHOR / {author}</span><label>TOPIC<select name="topic">{newsletterTopics.map(topic=><option key={topic}>{topic}</option>)}</select></label></div><label>TITLE<input name="title" placeholder="A precise promise to the reader" required minLength={8}/></label><label>SUMMARY<textarea name="excerpt" placeholder="What will the reader understand after this issue?" required minLength={20}/></label><label>FIELD NOTE<textarea name="body" className="mmn-write-body" placeholder={"Start with the problem.\n\nExplain the system and tradeoffs.\n\nAdd a checklist or useful conclusion."} required minLength={120}/></label><button type="submit">[ PUBLISH FIELD NOTE ]</button><p role="status">{status}</p></form>;
}
