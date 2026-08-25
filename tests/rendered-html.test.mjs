import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test, { after, before } from "node:test";

const port = 42000 + (process.pid % 1000);
let server;

before(async () => {
  const projectRoot = fileURLToPath(new URL("../", import.meta.url));

  server = spawn(process.execPath, ["scripts/preview-vercel-build.mjs"], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
    stdio: "ignore",
  });

  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return;
    } catch {
      // The server may still be binding the port; retry until the deadline.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("Production server did not start in time.");
});

after(() => {
  server?.kill("SIGTERM");
});

async function render(pathname = "/") {
  return fetch(`http://127.0.0.1:${port}${pathname}`, {
    headers: { accept: "text/html" },
  });
}

test("server-renders the Muhammad Musa portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Muhammad Musa \| AI Engineer &amp; Product Builder<\/title>/i);
  assert.match(html, /I Build AI Products/);
  assert.match(html, /That Actually Ship/);
  assert.match(html, /AVAILABLE FOR PROJECTS/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /AI Agents &amp; Automation/);
  assert.match(html, /START A PROJECT/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/);
});

test("renders the moderated guestbook", async () => {
  const response = await render("/guestbook");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Guestbook\./);
  assert.match(html, /SIGN GUESTBOOK/);
  assert.match(html, /REVIEWED BEFORE PUBLISHING/);
  assert.match(html, /MUHAMMAD MUSA/);
});

test("includes the SEO and CI surfaces for production", async () => {
  const [layout, robots, sitemap, manifest, workflow, gitignore] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/manifest.ts", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/verify.yml", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /application\/ld\+json/);
  assert.match(layout, /NEXT_PUBLIC_SITE_URL/);
  assert.match(robots, /disallow:\s*\["\/api\/"\]/);
  assert.match(sitemap, /blogPosts/);
  assert.match(sitemap, /services/);
  assert.match(manifest, /Muhammad Musa Portfolio/);
  assert.match(workflow, /yarn install --frozen-lockfile/);
  assert.match(workflow, /yarn lint/);
  assert.match(workflow, /yarn test/);
  assert.match(gitignore, /^\.env\*/m);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
