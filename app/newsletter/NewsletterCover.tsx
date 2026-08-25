import type { CSSProperties } from "react";
import type { NewsletterPost } from "../../lib/newsletter-data";

type CoverPost = Pick<NewsletterPost, "issue" | "color" | "topic" | "label" | "title">;

// A pool of faint "field-notes" lines — a mix of prose and math — scattered
// behind the title so each cover reads like a scanned page of handwritten
// study notes. Each card draws a different subset (see pickNotes).
const NOTES = [
  "loss = −Σ y · log ŷ",
  "throughput ≈ batch ÷ latency",
  "if p99 > SLO → shed load",
  "H(X) = −Σ p log p",
  "int8:  q = round(x ÷ s)",
  "∇θ J(θ) → 0",
  "hit rate  r = h ÷ (h + m)",
  "cost ∝ tokens × price",
  "σ(z) = 1 ÷ (1 + e^−z)",
  "P(fail) = 1 − (1 − ε)ⁿ",
  "attn = softmax(QKᵀ ÷ √d) V",
  "mem = params × bytes",
  "λ > μ  →  queue grows",
  "recall = TP ÷ (TP + FN)",
  "the demo worked, prod did not",
  "warm start ≫ cold start",
  "drift:  D(p ‖ q) ↑",
  "backoff = base × 2ᵏ",
  "err ≈ O(1 ÷ √n)",
  "tokens/s = f(kv cache)",
  "batch ↑  →  latency ↑",
  "cache goes stale after write",
];

// One faint, full-width paragraph of notes+math per issue — a seeded shuffle
// (deterministic, so server and client render the same order) gives each card
// its own scanned page. Justified in CSS so it bleeds across the whole card,
// not just the left column. Several differently-seeded passes are concatenated
// so the text fills tall covers too (the article-page hero is ~4x a grid card).
function shuffled(seed: number): string {
  const pool = [...NOTES];
  let s = (seed * 2654435761) >>> 0 || 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.join("   ");
}

function ghostText(seed: number): string {
  return Array.from({ length: 5 }, (_, p) => shuffled(seed + p * 101)).join("   ");
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "to", "of", "and", "or", "in", "on", "for", "that", "your", "not", "with",
]);

// A short, cover-friendly version of the title: drop any subtitle after a colon
// or dash, keep the first few words, and trim trailing filler words so it never
// ends on "the"/"is"/etc.
function shorten(title: string): string {
  // Split only on colon / en-dash / em-dash — never a hyphen, so words like
  // "Cache-Aside", "Fine-Tuning" and "Permission-Aware" stay intact.
  let base = title.split(/[:–—]| - /)[0].trim();
  // If the part before the colon is too short (e.g. "Quantization: The Useful
  // Version" -> "Quantization"), fall back to the whole title.
  if (base.split(/\s+/).length < 2) base = title.replace(/[:–—]/g, " ").replace(/\s+/g, " ").trim();
  const words = base.split(/\s+/).slice(0, 5);
  while (words.length > 2 && STOP_WORDS.has(words[words.length - 1].toLowerCase())) words.pop();
  return words.join(" ");
}

export function NewsletterCover({ post, featured }: { post: CoverPost; featured?: boolean }) {
  const style = { "--post-color": post.color } as CSSProperties;
  const short = shorten(post.title);
  const seed = Number(String(post.issue).replace(/\D/g, "")) || 0;
  const ghost = ghostText(seed);

  // Highlight the topic/label keyword if it appears in the short title,
  // otherwise highlight the first word.
  const candidates = [post.label, post.topic, ...post.label.split(/\s+/), ...post.topic.split(/\s+/)]
    .filter((value) => value.length > 2)
    .sort((a, b) => b.length - a.length);
  const term = candidates.find((candidate) => short.toLowerCase().includes(candidate.toLowerCase()));

  let before = short;
  let key = "";
  let after = "";
  if (term) {
    const at = short.toLowerCase().indexOf(term.toLowerCase());
    before = short.slice(0, at);
    key = short.slice(at, at + term.length);
    after = short.slice(at + term.length);
  } else {
    const space = short.indexOf(" ");
    if (space > 0) {
      before = "";
      key = short.slice(0, space);
      after = short.slice(space);
    }
  }

  return (
    <div className={`mmn-cover${featured ? " is-featured" : ""}`} style={style} aria-label={`${post.title} cover`}>
      <span className="mmn-cover-paper" aria-hidden="true" />
      <span className="mmn-cover-ghost" aria-hidden="true">{ghost}</span>
      <span className="mmn-cover-noise" aria-hidden="true" />
      <span className="mmn-cover-copy">
        <strong>
          {before}
          {key && <mark>{key}</mark>}
          {after}
        </strong>
      </span>
    </div>
  );
}
