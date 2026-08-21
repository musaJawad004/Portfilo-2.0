import { createRequire } from "module";
import path from "path";
import { defineConfig } from "vite";
import vinext from "vinext";
import { nitro } from "nitro/vite";

const require = createRequire(import.meta.url);
const tailwindcssRoot = path.dirname(require.resolve("tailwindcss/package.json"));

export default defineConfig({
  // Nitro's CSS pipeline resolves bare "@import tailwindcss" as a file path;
  // alias it to the package so PostCSS can load the real entry.
  resolve: {
    alias: {
      tailwindcss: tailwindcssRoot,
    },
  },
  plugins: [vinext(), nitro()],
});
