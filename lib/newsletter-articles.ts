// Bespoke, hand-authored articles. When a slug has an entry here, the newsletter
// renders these rich blocks instead of the generated field-note template. This is
// how individual issues get real research, a topic-specific teaching structure,
// and hand-drawn Mermaid diagrams — one article at a time.

export type Tone = "ink" | "blue" | "green" | "red" | "orange" | "purple";

export type SourceItem = { label: string; url: string; type?: string };

export type ArticleBlock =
  // Opening stand-first, set larger than body text.
  | { kind: "lead"; text: string }
  // Section heading (rendered as <h2>). Headings must be specific to the topic.
  | { kind: "h2"; text: string }
  // Body paragraph. Supports inline **bold**, `code`, and [text](url).
  | { kind: "p"; text: string }
  // A hand-drawn Mermaid diagram plus an optional caption.
  | { kind: "figure"; diagram: string; caption?: string }
  // Code sample with a language tag and optional caption.
  | { kind: "code"; lang: string; caption?: string; code: string }
  // Handwritten margin call-out. Tone drives the accent colour.
  | { kind: "callout"; tone: Tone; label: string; text: string }
  // Comparison table.
  | { kind: "table"; caption?: string; columns: string[]; rows: string[][] }
  // Primary-source list rendered at the foot of the article.
  | { kind: "sources"; items: SourceItem[] };

export type AuthoredArticle = {
  slug: string;
  // Optional overrides for the generated seed metadata.
  title?: string;
  excerpt?: string;
  readingMinutes?: number;
  blocks: ArticleBlock[];
};

import { quantizationArticle } from "./articles/quantization";
import { generatedArticles } from "./articles/generated";
import { addedArticles } from "./articles/added";

const registry: Record<string, AuthoredArticle> = {
  [quantizationArticle.slug]: quantizationArticle,
};

// Hand-crafted articles win over generated ones for the same slug.
for (const article of [...addedArticles, ...generatedArticles]) {
  if (!registry[article.slug]) registry[article.slug] = article;
}

export function getAuthoredArticle(slug: string): AuthoredArticle | undefined {
  return registry[slug];
}

export function hasAuthoredArticle(slug: string): boolean {
  return slug in registry;
}
