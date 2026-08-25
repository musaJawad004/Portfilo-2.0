// Dev-only fix: silence the transient @vitejs/plugin-rsc overlay
// "Cannot read properties of undefined (reading 'import')" that fires during
// HMR/startup when the RSC environment's runner is briefly undefined. The page
// itself still serves 200; this only stops the false BUILD ERROR overlay from
// covering it. Reapplied on every install via the postinstall hook.
//
// Safe by design: it only edits a dev-server code path (the client HMR
// `hot.send` override), is idempotent (marker guard), and never throws — so it
// cannot break `yarn install` or a Vercel build.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

try {
  const dir = "node_modules/@vitejs/plugin-rsc/dist";
  if (!existsSync(dir)) process.exit(0);
  const file = readdirSync(dir).find((f) => /^plugin-.*\.js$/.test(f));
  if (!file) process.exit(0);
  const path = join(dir, file);
  let src = readFileSync(path, "utf8");

  const marker = "MMN_RSC_OVERLAY_PATCH";
  if (src.includes(marker)) process.exit(0);

  const anchor = "return oldSend.apply(this, args);";
  if (!src.includes(anchor)) {
    console.log("[patch-rsc-dev] anchor not found (plugin changed?) — skipping");
    process.exit(0);
  }

  const inject =
    `if (/* ${marker} */ e && typeof e === "object" && e.type === "error" && e.err && ` +
    `typeof e.err.message === "string" && e.err.message.includes("reading 'import'")) { return; }\n\t\t\t\t\t` +
    anchor;

  // Replace only the first occurrence (the client hot.send override).
  src = src.replace(anchor, inject);
  writeFileSync(path, src);
  console.log("[patch-rsc-dev] applied dev overlay suppression to", file);
} catch (error) {
  console.log("[patch-rsc-dev] skipped:", error && error.message);
}
