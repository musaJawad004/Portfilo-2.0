"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SubscribeForm } from "./SubscribeForm";

type SearchItem = { slug: string; title: string; topic: string };

export function NewsletterHeaderClient({ searchItems }: { searchItems: SearchItem[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareTitle, setShareTitle] = useState("Muhammad Musa Newsletter");
  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();

  // Once the reader has subscribed, drop the SUBSCRIBE call-to-action.
  useEffect(() => {
    try {
      if (localStorage.getItem("mmn-email")) setSubscribed(true);
    } catch {
      // ignore
    }
    const onSubscribed = () => setSubscribed(true);
    window.addEventListener("mmn-subscribed", onSubscribed);
    return () => window.removeEventListener("mmn-subscribed", onSubscribed);
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? searchItems.filter(item => `${item.title} ${item.topic}`.toLowerCase().includes(term)).slice(0, 8) : searchItems.slice(0, 6);
  }, [query, searchItems]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSubscribeOpen(false);
        setShareOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [searchOpen]);

  useEffect(() => {
    const openFromLink = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a[href$="#subscribe"]');
      if (!link) return;
      event.preventDefault();
      openSubscribe();
    };
    document.addEventListener("click", openFromLink);
    return () => document.removeEventListener("click", openFromLink);
  }, []);

  useEffect(() => {
    if (!shareOpen) return;
    const onDown = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) setShareOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [shareOpen]);

  function openSubscribe() {
    document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => setSubscribeOpen(true), 280);
  }

  function openShare() {
    setShareUrl(window.location.href);
    setShareTitle(document.title?.replace(" | Muhammad Musa", "") || "Muhammad Musa Newsletter");
    setCopied(false);
    setShareOpen((open) => !open);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    const data = { title: shareTitle, text: shareTitle, url: shareUrl || window.location.href };
    if (navigator.share) {
      await navigator.share(data).catch(() => undefined);
      setShareOpen(false);
    } else {
      await copyLink();
    }
  }

  const encUrl = encodeURIComponent(shareUrl);
  const encTitle = encodeURIComponent(shareTitle);
  const shareTargets = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}` },
    { label: "X / Twitter", href: `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}` },
    { label: "Email", href: `mailto:?subject=${encTitle}&body=${encodeURIComponent(`${shareTitle}\n\n${shareUrl}`)}` },
  ];

  return <>
    <header className="mmn-header">
      <a className="mmn-logo" href="/newsletter" aria-label="Muhammad Musa Newsletter home">
        <img src="/favicon-mm-white.svg" width={40} height={40} alt="Muhammad Musa" />
      </a>
      <a className="mmn-brand" href="/newsletter">MUHAMMAD MUSA NEWSLETTER</a>
      <div className="mmn-header-actions">
        <button type="button" className="mmn-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search issues">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
        </button>
        <div className="mmn-share" ref={shareRef}>
          <button type="button" className="mmn-icon-btn" onClick={openShare} aria-label="Share" aria-expanded={shareOpen} aria-haspopup="menu">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><line x1="8" y1="11" x2="16" y2="7" /><line x1="8" y1="13" x2="16" y2="17" /></svg>
          </button>
          {shareOpen && <div className="mmn-share-menu" role="menu" aria-label="Share this newsletter">
            <span className="mmn-share-title">SHARE</span>
            <button type="button" role="menuitem" onClick={copyLink}>{copied ? "✓ Link copied" : "Copy link"}</button>
            {shareTargets.map((target) => (
              <a key={target.label} role="menuitem" href={target.href} target="_blank" rel="noreferrer" onClick={() => setShareOpen(false)}>{target.label}</a>
            ))}
            <button type="button" role="menuitem" onClick={nativeShare}>More…</button>
          </div>}
        </div>
        {!subscribed && <button className="mmn-subscribe-jump" type="button" onClick={openSubscribe}>SUBSCRIBE</button>}
      </div>
    </header>
    <nav className="mmn-primary-nav" aria-label="Newsletter navigation">
      <a className={pathname === "/newsletter" ? "is-active" : ""} href="/newsletter">Home</a>
      <a className={pathname === "/newsletter/about" ? "is-active" : ""} href="/newsletter/about">About</a>
    </nav>
    {searchOpen && <div className="mmn-search" role="dialog" aria-modal="true" aria-label="Search newsletter">
      <button className="mmn-search-backdrop" onClick={() => setSearchOpen(false)} aria-label="Close search" />
      <section><header><span className="mmn-kicker">SEARCH / 54 FIELD NOTES</span><button onClick={() => setSearchOpen(false)}>CLOSE ×</button></header><input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search agents, RAG, mobile, systems..." />
        <div>{matches.map(item => <a key={item.slug} href={`/newsletter/${item.slug}`}><span>{item.topic}</span><strong>{item.title}</strong><i>↗</i></a>)}</div>
      </section>
    </div>}
    {subscribeOpen && <div className="mmn-modal" role="dialog" aria-modal="true" aria-labelledby="mmn-subscribe-title">
      <button className="mmn-modal-backdrop" onClick={() => setSubscribeOpen(false)} aria-label="Close subscribe dialog" />
      <section className="mmn-modal-panel">
        <header><span className="mmn-kicker">THE DAILY SIGNAL</span><button type="button" onClick={() => setSubscribeOpen(false)}>CLOSE ×</button></header>
        <div className="mmn-modal-content"><h2 id="mmn-subscribe-title">Get the useful part.</h2><p>Choose what you build. I will send one researched, unread field note matched to those interests.</p><SubscribeForm onSuccess={() => window.setTimeout(() => setSubscribeOpen(false), 900)} /></div>
      </section>
    </div>}
  </>;
}
