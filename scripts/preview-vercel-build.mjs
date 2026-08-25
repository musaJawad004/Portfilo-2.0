import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import handler from "../.vercel/output/functions/__server.func/index.mjs";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const staticRoot = fileURLToPath(new URL("../.vercel/output/static/", import.meta.url));

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function serveStatic(pathname, outgoing) {
  const decodedPath = decodeURIComponent(pathname).replace(/^\/+/, "");
  const candidate = resolve(staticRoot, decodedPath);

  if (!candidate.startsWith(resolve(staticRoot))) return false;

  try {
    const fileStat = await stat(candidate);
    if (!fileStat.isFile()) return false;

    outgoing.statusCode = 200;
    outgoing.setHeader("content-type", contentTypes[extname(candidate)] || "application/octet-stream");
    outgoing.setHeader("content-length", fileStat.size);
    outgoing.end(await readFile(candidate));
    return true;
  } catch {
    return false;
  }
}

createServer(async (incoming, outgoing) => {
  try {
    const requestUrl = new URL(incoming.url || "/", `http://${host}:${port}`);
    if ((incoming.method === "GET" || incoming.method === "HEAD") && await serveStatic(requestUrl.pathname, outgoing)) {
      return;
    }

    const chunks = [];
    for await (const chunk of incoming) chunks.push(chunk);
    const method = incoming.method || "GET";
    const request = new Request(`http://${host}:${port}${incoming.url || "/"}`, {
      method,
      headers: incoming.headers,
      body: method === "GET" || method === "HEAD" ? undefined : Buffer.concat(chunks),
      duplex: "half",
    });
    const response = await handler.fetch(request, { waitUntil() {} });
    outgoing.statusCode = response.status;
    response.headers.forEach((value, name) => outgoing.setHeader(name, value));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    outgoing.statusCode = 500;
    outgoing.end("Preview server error");
  }
}).listen(port, host, () => {
  console.log(`Previewing Vercel build at http://${host}:${port}`);
});
