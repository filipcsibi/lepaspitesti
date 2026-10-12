import type { ModelDefinition } from "../types";

const m = (file: string) => `/media/models/l4/${file}`;

export const lepasL4: ModelDefinition = {
  slug: "lepas-l4",
  messagesKey: "lepasL4",
  background: "#0c111e",
  sections: [
    {
      type: "hero",
      slides: [{ src: m("banner.jpg"), mobileSrc: m("banner_mb.jpg") }],
      titleKey: "name",
    },
    {
      type: "videoIntro",
      video: m("v0.mp4"),
    },
    {
      type: "exterior",
      labelKey: "labels.appearance",
      colors: [{ swatch: "", ring: "", image: { src: m("appearance_bg.jpg"), mobileSrc: m("appearance_bgmb.jpg") } }],
    },
    {
      type: "interiorImage",
      labelKey: "labels.interior",
      image: { src: m("interior_pic.jpg"), mobileSrc: m("interior_pic_mb.jpg") },
    },
  ],
};
