import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "public", "newsletter");
const cards = [
  ["agents", "AGENT", "RUNTIME", "#8BE95B"], ["rag", "RAG", "SYSTEM", "#F3E84D"],
  ["models", "MODEL", "OPS", "#F2B84B"], ["mobile", "MOBILE", "AI", "#8ED7FF"],
  ["backend", "BACKEND", "SYSTEM", "#E9A1FF"], ["cloud", "CLOUD", "OPS", "#A7F0D1"],
  ["developer-tools", "DEV", "TOOLS", "#FF9E9E"], ["ai-research", "AI", "RESEARCH", "#C7B7FF"],
];
await mkdir(out, { recursive: true });
for (const [name, a, b, color] of cards) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750"><rect width="1200" height="750" fill="#ebeae5"/><defs><pattern id="d" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#c9c8c1"/></pattern></defs><rect width="1200" height="750" fill="url(#d)"/><rect x="170" y="244" width="860" height="74" fill="${color}"/><text x="600" y="306" font-family="Arial, sans-serif" font-weight="800" font-size="90" text-anchor="middle" fill="#111">${a}</text><text x="600" y="425" font-family="Arial, sans-serif" font-weight="800" font-size="90" text-anchor="middle" fill="#111">${b}</text><text x="60" y="690" font-family="monospace" font-size="24" fill="#555">MUHAMMAD MUSA / NEWSLETTER</text></svg>`;
  await writeFile(join(out, `${name}.svg`), svg);
}
console.log(`Generated ${cards.length} newsletter art templates in ${out}`);
