"use client";

import { FormEvent, useEffect, useState } from "react";

import { BackgroundPixelStars } from "@/components/ui/background-pixel-stars";

type FormStatus = "idle" | "sending" | "success" | "error";

const socialLinks = [
  { label: "GITHUB", handle: "musaJawad004", href: "https://github.com/musaJawad004" },
  { label: "LINKEDIN", handle: "muhammadmusadev", href: "https://www.linkedin.com/in/muhammadmusadev/" },
  { label: "GMAIL", handle: "musajawad004@gmail.com", href: "mailto:musajawad004@gmail.com" },
];

export function SiteFooter() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [localTime, setLocalTime] = useState("--:--:--");

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date()));
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setFeedback("SENDING YOUR MESSAGE...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) throw new Error(result.message || "Message could not be sent.");

      setStatus("success");
      setFeedback("MESSAGE RECEIVED. I WILL REPLY SOON.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message.toUpperCase() : "MESSAGE COULD NOT BE SENT.");
    }
  }

  return (
    <footer className="site-footer" aria-labelledby="contact-title">
      <header className="site-footer-heading">
        <div>
          <p>009 / CONTACT</p>
          <h2 id="contact-title">Let&apos;s Build Something Real.</h2>
        </div>
        <p>AVAILABLE / LAHORE / REMOTE</p>
      </header>

      <div className="site-footer-grid">
        <aside className="footer-social-panel" aria-label="Social profiles">
          <div className="footer-panel-label">
            <span>01 / SOCIAL</span>
            <span>FOLLOW / CONNECT</span>
          </div>
          <div className="footer-social-copy">
            <BackgroundPixelStars className="footer-star-canvas" />
            <p>Find my work, connect, or start a conversation.</p>
          </div>
          <div className="footer-status-grid" aria-label="Current status">
            <div>
              <span>LOCAL TIME / LHR</span>
              <strong>{localTime} PKT</strong>
            </div>
            <div>
              <span><i aria-hidden="true" />STATUS</span>
              <strong>OPEN FOR WORK</strong>
            </div>
            <div>
              <span>FOCUS</span>
              <strong>AI + PRODUCT</strong>
            </div>
          </div>
          <nav className="footer-social-links">
            {socialLinks.map((social, index) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                <span>0{index + 1}</span>
                <strong>{social.label}</strong>
                <small>@{social.handle}</small>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </nav>
        </aside>

        <section className="footer-form-panel" id="contact" aria-label="Contact form">
          <div className="footer-panel-label">
            <span>02 / START A PROJECT</span>
            <span>RESPONSE / 24-48H</span>
          </div>
          <div className="footer-form-copy">
            <p>Tell me what you are building.</p>
            <h3>AI product, mobile app, or production system.</h3>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              <span>YOUR NAME</span>
              <input name="name" type="text" autoComplete="name" required maxLength={80} placeholder="Muhammad Musa" />
            </label>
            <label>
              <span>EMAIL ADDRESS</span>
              <input name="email" type="email" autoComplete="email" required maxLength={160} placeholder="you@company.com" />
            </label>
            <label className="contact-form-wide">
              <span>WHAT ARE WE BUILDING?</span>
              <textarea name="message" required minLength={20} maxLength={3000} rows={5} placeholder="Share the product, problem, timeline, and what success looks like." />
            </label>
            <label className="contact-honeypot" aria-hidden="true">
              <span>WEBSITE</span>
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="contact-form-submit">
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "[ SENDING... ]" : "[ SEND MESSAGE ]"}
              </button>
              <p className={`contact-feedback contact-feedback-${status}`} aria-live="polite">{feedback}</p>
            </div>
          </form>
        </section>

        <figure className="footer-gif-panel">
          <img src="/contact-studio.gif" alt="Pixel art developer studio animation" />
          <figcaption>
            <span>03 / BUILD MODE</span>
            <strong>IDEA TO PRODUCTION</strong>
          </figcaption>
        </figure>
      </div>

      <div className="site-footer-bottom">
        <p>MUHAMMAD MUSA / AI ENGINEER + PRODUCT BUILDER</p>
        <p>AI / MOBILE / FULL STACK</p>
        <a href="/guestbook">GUESTBOOK ↗</a>
        <a href="/privacy">PRIVACY POLICY ↗</a>
        <p>© 2026</p>
      </div>
    </footer>
  );
}
