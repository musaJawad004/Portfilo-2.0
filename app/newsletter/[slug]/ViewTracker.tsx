"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const email = localStorage.getItem("mmn-email");
    if (email) fetch("/api/newsletter/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, slug }), keepalive: true });
    fetch("/api/newsletter/interactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "view", slug }), keepalive: true }).catch(() => undefined);

    let lastSent = -1;
    let timer = 0;
    const saveProgress = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const root = document.documentElement;
        const available = Math.max(1, root.scrollHeight - window.innerHeight);
        const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / available) * 100)));
        if (progress < 5 || Math.abs(progress - lastSent) < 5) return;
        lastSent = progress;
        fetch("/api/newsletter/interactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "progress", slug, progress }), keepalive: true }).catch(() => undefined);
      }, 450);
    };
    window.addEventListener("scroll", saveProgress, { passive: true });
    return () => { window.removeEventListener("scroll", saveProgress); window.clearTimeout(timer); };
  }, [slug]);
  return null;
}
