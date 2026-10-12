/**
 * About pages configuration (media & colours).
 * Text lives in `messages/<locale>/about.json`.
 */
const intro = (file: string) => `/media/about/introduction/${file}`;
const values = (file: string) => `/media/about/brand-values/${file}`;

export type ChapterKey = "city" | "balance" | "art" | "symbol";

export const introductionContent = {
  banner: { src: intro("banner.jpg"), mobileSrc: intro("banner_mb.jpg") },
  /** Masks the videos are revealed through (parts of the LEPAS lettering). */
  masks: { logo: intro("logo.svg"), stroke1: intro("logo2.png"), stroke2: intro("logo3.png") },
  videos: {
    logo: { src: intro("Introduction-0.3.mp4"), poster: intro("video-preview-0.3.png") },
    city: { src: intro("Introduction-1.mp4"), poster: intro("video-preview-1.jpg") },
    balance: { src: intro("Introduction-2.mp4"), poster: intro("video-preview-2.jpg") },
    art: { src: intro("Introduction-3.mp4"), poster: intro("video-preview-3.jpg") },
    symbol: { src: intro("Introduction-4.mp4"), poster: intro("video-preview-4.jpg") },
    finale: { src: intro("Introduction-5.mp4"), poster: intro("video-preview-5.jpg") },
  },
  /** Chapter order, heading colour (brand palette) and text side. */
  chapters: [
    { key: "city", color: "var(--color-freedom-blue)", glow: "#0c3a4a", align: "left" },
    { key: "balance", color: "var(--color-panther-orange)", glow: "#4a3504", align: "right" },
    { key: "art", color: "var(--color-dynamic-red)", glow: "#3d0f0b", align: "left" },
    { key: "symbol", color: "var(--color-aurora-green)", glow: "#063a2c", align: "right" },
  ] satisfies { key: ChapterKey; color: string; glow: string; align: "left" | "right" }[],
};

export type ValueKey = "aesthetics" | "technology" | "exploration" | "sustainability";

export const brandValuesContent = {
  banner: {
    video: values("banner.mp4"),
    poster: values("banner_cover.jpg"),
    mobileImage: values("banner_cover_m.jpg"),
  },
  texture: "/media/shared/bg.png",
  values: [
    { key: "aesthetics", background: "#1a1a1a", image: { src: values("p_0.jpg"), mobileSrc: values("p_0_m.jpg") } },
    { key: "technology", background: "#04182f", image: { src: values("p_1.jpg"), mobileSrc: values("p_1_m.jpg") } },
    { key: "exploration", background: "#1a1a1a", image: { src: values("p_2.jpg"), mobileSrc: values("p_2_m.jpg") } },
    { key: "sustainability", background: "#04182f", image: { src: values("p_3.jpg"), mobileSrc: values("p_3_m.jpg") } },
  ] satisfies { key: ValueKey; background: string; image: { src: string; mobileSrc: string } }[],
};
