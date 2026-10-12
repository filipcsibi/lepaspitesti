/**
 * Uploads every video in media-source/media to Vercel Blob and writes
 * src/config/media-manifest.json ({ "/media/…mp4": "https://…blob.vercel-storage.com/…" }).
 *
 * Videos are not committed: keep them in media-source/ (git-ignored), mirroring the
 * /media/… path used in the content files, e.g. media-source/media/home/intro.mp4.
 *
 * Usage: node --env-file=.env.local scripts/upload-videos.mjs
 */
import { put } from "@vercel/blob";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("media-source");
const MANIFEST = path.resolve("src/config/media-manifest.json");

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith(".mp4")) yield full;
  }
}

const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8").catch(() => "{}"));

for await (const file of walk(path.join(ROOT, "media"))) {
  const key = "/" + path.relative(ROOT, file).split(path.sep).join("/");
  const body = await fs.readFile(file);
  const blob = await put(key.slice(1), body, {
    access: "public",
    contentType: "video/mp4",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    multipart: body.length > 20 * 1024 * 1024,
  });
  manifest[key] = blob.url;
  console.log(`${(body.length / 1048576).toFixed(1).padStart(5)} MB  ${key}`);
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length} videos in ${path.relative(process.cwd(), MANIFEST)}`);
