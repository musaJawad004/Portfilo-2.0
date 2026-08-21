import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
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
