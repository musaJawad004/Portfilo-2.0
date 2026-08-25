"use client";

import { useEffect, useRef, useState } from "react";

// Mermaid is heavy and browser-only, so it is injected once via a <script> tag
// (see loadMermaid) and initialised a single time. The look is "handDrawn" and
// the palette is tuned to the newsletter's warm-paper editorial system so
// diagrams read like notebook sketches rather than corporate flowcharts.
type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, code: string) => Promise<{ svg: string }>;
};

let ready: Promise<MermaidApi> | null = null;
let counter = 0;

// The restrained status palette, injected into flow/state diagrams so authored
// content only needs to reference `:::ink`, `:::good`, or `:::bad`.
const PALETTE = `
    classDef ink fill:#eeede6,stroke:#1c1c1c,color:#1c1c1c;
    classDef good fill:#e8f1ea,stroke:#2f7d3a,color:#1e4025;
    classDef bad fill:#f6e7e3,stroke:#b23124,color:#5f1a12;`;

function withPalette(code: string): string {
  if (/^\s*(flowchart|graph|stateDiagram)/.test(code) && !/classDef\s+ink\b/.test(code)) {
    return `${code}\n${PALETTE}`;
  }
  return code;
}

// Mermaid is injected as the self-contained UMD build via a plain <script> tag,
// which sets window.mermaid. This keeps it completely out of Vite's module
// graph — bundling it through the RSC pipeline breaks on-demand dev transforms
// and bloats the server bundle. It only ever runs client-side.
const MERMAID_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.min.js";

function injectScript(): Promise<MermaidApi> {
  return new Promise((resolve, reject) => {
    const existing = (window as unknown as { mermaid?: MermaidApi }).mermaid;
    if (existing) return resolve(existing);
    const script = document.createElement("script");
    script.src = MERMAID_URL;
    script.async = true;
    script.onload = () => {
      const mermaid = (window as unknown as { mermaid?: MermaidApi }).mermaid;
      if (mermaid) resolve(mermaid);
      else reject(new Error("mermaid did not attach to window"));
    };
    script.onerror = () => reject(new Error("failed to load mermaid script"));
    document.head.appendChild(script);
  });
}

// Guarantee the Kalam @font-face is registered, then loaded, before Mermaid
// measures label widths. Without this, Mermaid sizes nodes against a narrower
// fallback font and the wider handwriting renders clipped.
async function ensureFont(): Promise<void> {
  if (typeof document === "undefined") return;
  const href = "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap";
  if (!document.querySelector(`link[data-mmn-font]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-mmn-font", "kalam");
    document.head.appendChild(link);
  }
  try {
    await Promise.all([
      document.fonts.load('400 16px "Kalam"'),
      document.fonts.load('700 16px "Kalam"'),
    ]);
    await document.fonts.ready;
  } catch {
    // best-effort; fall back to whatever is available
  }
}

// Timeline / journey diagrams colour each section from a 12-step scale
// (cScale0..11). Left at the theme default these render as tan/olive boxes,
// which breaks the monochrome system — so pin every step to paper fill with ink
// labels. Colour stays reserved for :::good / :::bad status, never decoration.
const monoScale: Record<string, string> = {};
for (let i = 0; i < 12; i += 1) {
  monoScale[`cScale${i}`] = "#f1f0e8";
  monoScale[`cScaleInv${i}`] = "#1c1c1c";
  monoScale[`cScaleLabel${i}`] = "#1c1c1c";
}

function loadMermaid(): Promise<MermaidApi> {
  if (ready) return ready;
  ready = injectScript().then((mermaid) => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      // The "handDrawn" look mis-sizes labels and over-fills nodes; the notebook
      // feel comes from the Kalam handwriting font + paper palette + graph frame,
      // while classic shapes keep every label readable.
      fontFamily: '"Kalam", "Comic Sans MS", "Segoe Print", cursive',
      flowchart: { curve: "basis", htmlLabels: true, padding: 14, nodeSpacing: 50, rankSpacing: 56 },
      sequence: { mirrorActors: false, actorMargin: 60, noteFontFamily: '"Kalam", cursive' },
      themeVariables: {
        background: "#f4f3ee",
        primaryColor: "#f1f0e8",
        primaryTextColor: "#161616",
        primaryBorderColor: "#161616",
        secondaryColor: "#eceae1",
        tertiaryColor: "#f1f0e8",
        lineColor: "#1c1c1c",
        textColor: "#1c1c1c",
        fontSize: "15px",
        // Sequence diagrams
        actorBkg: "#f1f0e8",
        actorBorder: "#161616",
        actorTextColor: "#161616",
        signalColor: "#1c1c1c",
        signalTextColor: "#1c1c1c",
        labelBoxBkgColor: "#eceae1",
        labelBoxBorderColor: "#161616",
        // Notes (used as handwritten call-outs)
        noteBkgColor: "#fbf3c9",
        noteTextColor: "#3a2f00",
        noteBorderColor: "#c9a400",
        // State diagrams
        clusterBkg: "#efeee6",
        clusterBorder: "#b9b7ac",
        // Timeline / journey sections stay paper + ink (see monoScale).
        ...monoScale,
        // Charts stay monochrome: colour is reserved for encoding status.
        xyChart: {
          backgroundColor: "transparent",
          titleColor: "#1c1c1c",
          xAxisLabelColor: "#1c1c1c",
          xAxisTitleColor: "#1c1c1c",
          xAxisLineColor: "#1c1c1c",
          yAxisLabelColor: "#1c1c1c",
          yAxisTitleColor: "#1c1c1c",
          yAxisLineColor: "#1c1c1c",
          plotColorPalette: "#4b4a45",
        },
      },
    });
    return mermaid;
  });
  return ready;
}

export function Mermaid({ code }: { code: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let active = true;
    setError(null);
    setRendered(false);
    Promise.all([loadMermaid(), ensureFont()])
      .then(async ([mermaid]) => {
        const id = `mmd-${(counter += 1)}-${Math.floor(Math.random() * 1e6)}`;
        try {
          const { svg } = await mermaid.render(id, withPalette(code.trim()));
          if (!active || !host.current) return;
          host.current.innerHTML = svg;
          setRendered(true);
        } catch (renderErr) {
          if (!active) return;
          setError(renderErr instanceof Error ? renderErr.message : String(renderErr));
        }
      })
      .catch((loadErr) => {
        if (active) setError(loadErr instanceof Error ? loadErr.message : String(loadErr));
      });
    return () => {
      active = false;
    };
  }, [code]);

  return (
    <div className="mmn-mermaid" data-rendered={rendered}>
      <div ref={host} aria-hidden={error ? true : undefined} />
      {!rendered && !error && <div className="mmn-mermaid-loading">sketching diagram…</div>}
      {error && (
        <details className="mmn-mermaid-error">
          <summary>Diagram could not render</summary>
          <pre>{code.trim()}</pre>
          <small>{error}</small>
        </details>
      )}
    </div>
  );
}
