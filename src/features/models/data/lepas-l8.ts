import type { ModelDefinition } from "../types";

const m = (file: string) => `/media/models/l8/${file}`;

export const lepasL8: ModelDefinition = {
  slug: "lepas-l8",
  messagesKey: "lepasL8",
  background: "#0c111e",
  sections: [
    {
      type: "hero",
      slides: [
        { src: m("1764062236211696.jpg"), mobileSrc: m("1764062245625429.jpg") },
        { src: m("1764062198855967.jpg"), mobileSrc: m("1764062208264062.jpg") },
        { src: m("1764062150775897.jpg"), mobileSrc: m("1764062160527733.jpg") },
        { src: m("1763966871896753.jpg") },
      ],
    },
    {
      type: "videoIntro",
      video: m("1758525774506671.mp4"),
      textKey: "intro",
    },
    {
      type: "exterior",
      labelKey: "labels.appearance",
      colors: [
        {
          swatch: m("1764065259714112.png"),
          ring: "#256268",
          image: { src: m("1764065269173272.jpg"), mobileSrc: m("1764065280554379.jpg") },
        },
        {
          swatch: m("1764065214716214.png"),
          ring: "#736c94",
          image: { src: m("1764065224317588.jpg"), mobileSrc: m("1764065232647758.jpg") },
        },
        {
          swatch: m("1764065078492714.png"),
          ring: "#9e9e9e",
          image: { src: m("1764065119021765.jpg"), mobileSrc: m("1764065133153324.jpg") },
        },
        {
          swatch: m("1764064966803766.png"),
          ring: "#798b9d",
          image: { src: m("1764065001076022.jpg"), mobileSrc: m("1764065016322092.jpg") },
        },
        {
          swatch: m("1764064779896090.png"),
          ring: "#e2e2e2",
          image: { src: m("1764064793382247.jpg"), mobileSrc: m("1764064811787049.jpg") },
        },
        {
          swatch: m("1764064596348086.png"),
          ring: "#090909",
          image: { src: m("1764064722531909.jpg"), mobileSrc: m("1764064736819723.jpg") },
        },
      ],
      specs: [
        { labelKey: "specs.length", value: 4688, unit: "mm" },
        { labelKey: "specs.width", value: 1871, unit: "mm" },
        { labelKey: "specs.height", value: 1686, unit: "mm" },
        { labelKey: "specs.wheelbase", value: 2800, unit: "mm" },
      ],
      hotspots: [
        { titleKey: "hotspots.frontFascia", image: m("1758525951266889.jpg"), top: 48, right: 54 },
        { titleKey: "hotspots.headlights", image: m("1758526086594997.jpg"), top: 46, right: 42 },
        { titleKey: "hotspots.cockpit", image: m("1764123336395450.jpg"), top: 35, right: 35 },
        { titleKey: "hotspots.doorHandle", image: m("1764064413679367.jpg"), top: 43, right: 18 },
        { titleKey: "hotspots.bionicDesign", image: m("1758526033549513.jpg"), top: 48, right: 23 },
        { titleKey: "hotspots.taillights", image: m("1758526011079601.jpg"), top: 39, right: 14 },
      ],
    },
    {
      type: "fullscreenSlider",
      labelKey: "labels.luxuriousSpace",
      variant: "caption",
      slides: [
        {
          video: m("1764139503026712.mp4"),
          image: { src: m("1764065659726770.jpg") },
          titleKey: "interior.flexibleSpace",
        },
        {
          video: m("1764065614053401.mp4"),
          image: { src: m("1764065594211466.jpg") },
          titleKey: "interior.windshield",
        },
        { video: m("1764065432777914.mp4"), image: { src: m("1764065403246003.jpg") }, titleKey: "interior.seats" },
      ],
    },
    {
      type: "colorShowcase",
      labelKey: "labels.luxuriousSpace",
      titleKey: "cockpit.title",
      colors: [
        {
          swatch: m("1764065812256795.png"),
          ring: "#d1b690",
          image: { src: m("1764065821004875.jpg"), mobileSrc: m("1764065832809329.jpg") },
        },
        {
          swatch: m("1764065742114359.png"),
          ring: "#242424",
          image: { src: m("1764123336395450.jpg"), mobileSrc: m("1764067363716146.jpg") },
        },
      ],
    },
    {
      type: "cardCarousel",
      titleKey: "thirdSpace.title",
      background: m("interior_bg.jpg"),
      items: [
        { image: m("1764067737420543.jpg"), titleKey: "thirdSpace.natureDesign" },
        { image: m("1764067698442149.jpg"), titleKey: "thirdSpace.speakers" },
        { image: m("1764067662229683.jpg"), titleKey: "thirdSpace.velvet" },
        { image: m("1764131630754477.jpg"), titleKey: "thirdSpace.hmi" },
        { image: m("1764067523455093.jpg"), titleKey: "thirdSpace.phoneDock" },
      ],
    },
    {
      type: "power",
      labelKey: "labels.power",
      background: m("power_bg.jpg"),
      image: { src: m("power.jpg"), mobileSrc: m("power_mb.jpg") },
      stageKeys: ["power.stage1", "power.stage2", "power.stage3"],
      features: [
        { icon: m("icon0.png"), labelKey: "power.electricExperience" },
        { icon: m("icon1.png"), labelKey: "power.lowConsumption" },
        { icon: m("icon2.png"), labelKey: "power.longRange" },
      ],
      specs: [
        { labelKey: "specs.eRange", value: 103, unit: "km" },
        { labelKey: "specs.combinedRange", value: 1200, unit: "km", prefix: "over" },
        { labelKey: "specs.combinedFuel", value: 1.49, decimals: 2, unit: "L/100km" },
      ],
      efficiency: [
        {
          image: m("engine_e0.png"),
          spec: { labelKey: "specs.thermalEfficiency", value: 44.5, decimals: 1, unit: "%" },
        },
        {
          image: m("engine_e1.png"),
          spec: { labelKey: "specs.mechanicalEfficiency", value: 97.6, decimals: 1, unit: "%" },
        },
        { image: m("engine_e2.png"), spec: { labelKey: "specs.electricRange", value: 100, unit: "km" } },
      ],
    },
    {
      type: "fullscreenSlider",
      labelKey: "labels.elegantDriving",
      variant: "feature",
      slides: [
        {
          image: { src: m("1764123336395450.jpg"), mobileSrc: m("1764067363716146.jpg") },
          titleKey: "driving.iovTitle",
          textKey: "driving.iovText",
        },
        {
          video: m("1764068301978634.mp4"),
          image: { src: m("1764068280732549.jpg") },
          titleKey: "driving.surroundTitle",
        },
      ],
    },
    {
      type: "film",
      video: m("1764068551634210.mp4"),
      cover: { src: m("1764068478023002.jpg"), mobileSrc: m("1764068486612430.jpg") },
      playIcon: m("play.png"),
    },
    {
      type: "gallery",
      titleKey: "gallery.title",
      groups: [
        [m("1764068759724511.jpg"), m("1764068773164286.jpg"), m("1764068784917412.jpg")],
        [m("1764068719079884.jpg")],
        [m("1764068669314939.jpg"), m("1764068684827364.jpg")],
      ],
    },
  ],
};
