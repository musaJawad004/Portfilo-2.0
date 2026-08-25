"use client";

import { useEffect, useState } from "react";
import { SubscribeForm } from "./SubscribeForm";

// A first-visit subscribe gate. Shows on the first newsletter visit, then again
// only every few visits if the reader has not subscribed — a reminder, not a
// nag. Dismissing ("Not now") just closes it for this visit.
export function FirstVisitSubscribe() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let subscribed = false;
    let visits = 1;
    try {
      subscribed = Boolean(localStorage.getItem("mmn-email"));
      visits = Number(localStorage.getItem("mmn-visits") || "0") + 1;
      localStorage.setItem("mmn-visits", String(visits));
    } catch {
      return;
    }
    if (subscribed) return;
    if (visits === 1 || visits % 5 === 0) {
      const id = window.setTimeout(() => setOpen(true), 1100);
      return () => window.clearTimeout(id);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    // Lock background scroll while the gate is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="mmn-gate" role="dialog" aria-modal="true" aria-labelledby="mmn-gate-title">
      <button className="mmn-gate-backdrop" onClick={() => setOpen(false)} aria-label="Dismiss" />
      <section className="mmn-gate-panel">
        <img className="mmn-gate-logo" src="/favicon-mm-white.svg" width={68} height={68} alt="Muhammad Musa" />
        <h2 id="mmn-gate-title">Muhammad Musa Newsletter</h2>
        <p className="mmn-gate-tag">Field notes for people building AI products that have to work after the demo. One researched issue, most days.</p>
        <p className="mmn-gate-by">By Muhammad Musa · Researched from primary sources</p>
        <div className="mmn-gate-form">
          <SubscribeForm onSuccess={() => window.setTimeout(() => setOpen(false), 900)} />
        </div>
        <button className="mmn-gate-dismiss" type="button" onClick={() => setOpen(false)}>Not now →</button>
      </section>
    </div>
  );
}
