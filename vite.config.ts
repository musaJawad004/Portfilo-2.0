import { createRequire } from "module";
import path from "path";
import { defineConfig } from "vite";
import vinext from "vinext";
import { nitro } from "nitro/vite";

const require = createRequire(import.meta.url);
const tailwindcssRoot = path.dirname(require.resolve("tailwindcss/package.json"));

export default defineConfig({
  server: {
    // A vinext/plugin-rsc dev quirk occasionally throws a non-fatal
    // "environment.runner" error on RSC requests; the page still renders and
    // production is unaffected. Suppress the blocking overlay in dev.
    hmr: { overlay: false },
    watch: {
      // macOS desktop sessions can expose a very small per-process watcher
      // allowance. Polling keeps HMR reliable instead of dropping CSS after
      // the watcher hits EMFILE during repeated edits.
      usePolling: true,
      interval: 300,
      ignored: [
        "**/.git/**",
        "**/.next/**",
        "**/.vinext/**",
        "**/.vercel/**",
        "**/.wrangler/**",
        "**/.output/**",
        "**/node_modules/**",
        "**/dist/**",
        "**/coverage/**",
      ],
    },
  },
  // Nitro's CSS pipeline resolves bare "@import tailwindcss" as a file path;
  // alias it to the package so PostCSS can load the real entry.
  resolve: {
    alias: {
      tailwindcss: tailwindcssRoot,
    },
  },
  plugins: [vinext(), nitro()],
});
