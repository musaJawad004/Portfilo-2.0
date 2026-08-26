"use client";

import { FormEvent, useState } from "react";
import { newsletterTopics } from "../lib/newsletter-data";

// Homepage call-out that sends visitors to the newsletter and lets them
// subscribe inline. Posts to the same /api/newsletter/subscribe endpoint the
// newsletter site uses (email + a random topic spread + honeypot).
export function NewsletterSection() {
  const [status, setStatus] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("Subscribing…");
    const topics = [...newsletterTopics].sort(() => Math.random() - 0.5).slice(0, 3);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), topics, website: data.get("website") }),
      });
      const result = (await res.json().catch(() => ({}))) as { message?: string };
      setStatus(result.message || (res.ok ? "You're subscribed." : "Something went wrong. Try again."));
      if (res.ok) {
        setDone(true);
        try {
          localStorage.setItem("mmn-email", String(data.get("email") || ""));
        } catch {
          // localStorage may be unavailable; not critical
        }
      }
    } catch {
      setStatus("Network error. Please try again.");
    }
  }

  return (
    <section className="home-news-section" id="newsletter" aria-labelledby="home-news-title">
      <header className="home-news-heading">
        <div>
          <p>009 / NEWSLETTER</p>
          <h2 id="home-news-title">Read the Newsletter.</h2>
        </div>
        <div>
          <p>
            Researched field notes on production AI, RAG, agents, models, mobile,
            and backend systems. Primary sources, no sponsored links.
          </p>
          <a href="/newsletter">
            [ VISIT THE NEWSLETTER ] <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <div className="home-news-panel">
        <div className="home-news-info">
          <span className="home-news-tag">FIELD NOTES / MOST DAYS</span>
          <p className="home-news-lead">
            One researched issue at a time, with the architecture choices and
            failure modes that matter after the demo.
          </p>
          <ul className="home-news-points">
            <li>Primary-source research</li>
            <li>Real numbers &amp; hand-drawn diagrams</li>
            <li>No spam, unsubscribe anytime</li>
          </ul>
        </div>

        <form className="home-news-form" onSubmit={submit}>
          <label htmlFor="home-news-email">SUBSCRIBE FOR FREE</label>
          <div className="home-news-field">
            <input
              id="home-news-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
              disabled={done}
            />
            <button type="submit" disabled={done}>
              [ {done ? "SUBSCRIBED" : "SUBSCRIBE"} ]
            </button>
          </div>
          <input aria-hidden="true" name="website" tabIndex={-1} autoComplete="off" className="home-news-hp" />
          <p className="home-news-status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}
