import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { resolveBasePath } from "../src/lib/paths.ts";

const root = path.resolve("out");
const base = resolveBasePath("", process.env.SITE_BASE_PATH);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
};
const server = http.createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (base && pathname === base) {
      response.writeHead(302, { Location: `${base}/` });
      response.end();
      return;
    }
    if (base && !pathname.startsWith(`${base}/`))
      throw new Error("Outside base path");
    if (base) pathname = pathname.slice(base.length);
    let target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(`${root}${path.sep}`) && target !== root)
      throw new Error("Outside export");
    if ((await stat(target)).isDirectory())
      target = path.join(target, "index.html");
    const content = await readFile(target);
    response.writeHead(200, {
      "Content-Type": types[path.extname(target)] ?? "application/octet-stream",
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(
      await readFile(path.join(root, "404.html")).catch(() => "Not found"),
    );
  }
});
server.listen(Number(process.env.PORT ?? 3000), "127.0.0.1", () =>
  console.log(`Local: http://localhost:${process.env.PORT ?? 3000}${base}/`),
);
