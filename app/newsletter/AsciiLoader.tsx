"use client";

import { useEffect, useState } from "react";

// Same glyph vocabulary as the home-page ASCII portrait, so loading states
// across the site feel like one system.
const GLYPHS = ".:•+*#@/\\|-=%".split("");
const WIDTH = 11;

export function AsciiLoader({ label }: { label?: string }) {
  const [frame, setFrame] = useState("·".repeat(WIDTH));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFrame("· loading ·");
      return;
    }
    const id = window.setInterval(() => {
      let next = "";
      for (let i = 0; i < WIDTH; i++) next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      setFrame(next);
    }, 85);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mmn-ascii-loader" role="status" aria-live="polite">
      <span className="mmn-ascii-glyphs" aria-hidden="true">{frame}</span>
      {label && <span className="mmn-kicker">{label}</span>}
    </div>
  );
}
