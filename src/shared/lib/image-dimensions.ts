import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { imageSize } from "image-size";

export type Dimensions = { width: number; height: number };

/** Reads the intrinsic size of an image in `/public` (server only, cached per request). */
export const getImageDimensions = cache(async (publicSrc: string): Promise<Dimensions> => {
  try {
    const file = await fs.readFile(path.join(process.cwd(), "public", publicSrc));
    const { width = 1920, height = 1080 } = imageSize(file);
    return { width, height };
  } catch {
    return { width: 1920, height: 1080 };
  }
});
