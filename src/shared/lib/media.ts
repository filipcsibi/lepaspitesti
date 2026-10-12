import manifest from "@/config/media-manifest.json";

const blobUrls: Record<string, string> = manifest;

/**
 * Resolves a media path used in content files (e.g. "/media/home/intro.mp4")
 * to its Vercel Blob URL. Videos are hosted on Blob (see scripts/upload-videos.mjs);
 * anything not in the manifest is served from /public as before.
 */
export function mediaUrl(src: string): string;
export function mediaUrl(src: string | undefined): string | undefined;
export function mediaUrl(src: string | undefined) {
  return src ? (blobUrls[src] ?? src) : src;
}
