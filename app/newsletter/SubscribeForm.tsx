"use client";

import { FormEvent, useState } from "react";
import { newsletterTopics } from "../../lib/newsletter-data";

export function SubscribeForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Subscribing…");
    const data = new FormData(event.currentTarget);
    // No "choose your signal" step: pick a random spread of topics for the reader.
    const topics = [...newsletterTopics].sort(() => Math.random() - 0.5).slice(0, 3);
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), topics, website: data.get("website") }),
    });
    const result = await response.json();
    setStatus(result.message || (response.ok ? "Subscribed." : "Try again."));
    if (response.ok) {
      localStorage.setItem("mmn-email", String(data.get("email") || ""));
      window.dispatchEvent(new Event("mmn-subscribed"));
      onSuccess?.();
    }
  }

  return (
    <form className="mmn-form" onSubmit={submit}>
      <label htmlFor="mmn-email">Email address</label>
      <input id="mmn-email" name="email" type="email" placeholder="you@company.com" required />
      <input aria-hidden="true" name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px" }} />
      <button className="mmn-submit" type="submit">[ SUBSCRIBE ]</button>
      <p className="mmn-form-status" aria-live="polite">{status}</p>
    </form>
  );
}
