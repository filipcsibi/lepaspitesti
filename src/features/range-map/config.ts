/**
 * "How far do you get from Pitești?" — the interactive range map.
 * Texts are in `messages/<locale>/rangeMap.json`.
 */

/** Where every trip starts: the showroom's city. */
export const origin = { name: "Pitești", lat: 44.8565, lon: 24.8692 };

export type RangeModeId = "l6-bev" | "l6-phev-electric" | "l6-phev-total";

export type RangeMode = {
  id: RangeModeId;
  /** Key in `rangeMap.modes`. */
  labelKey: "l6Bev" | "l6PhevElectric" | "l6PhevTotal";
  /** Official WLTP range in km — keep in sync with `src/features/models/data/lepas-l6-*.ts`. */
  rangeKm: number;
  /** Colour of the range ring (brand palette). */
  accent: string;
};

export const rangeModes: RangeMode[] = [
  { id: "l6-bev", labelKey: "l6Bev", rangeKm: 449, accent: "#00a985" },
  { id: "l6-phev-electric", labelKey: "l6PhevElectric", rangeKm: 92, accent: "#3c7dd2" },
  { id: "l6-phev-total", labelKey: "l6PhevTotal", rangeKm: 1058, accent: "#eb9201" },
];

/**
 * Roads are longer than the straight line between two cities — on average about 1.3× in Romania.
 * The ring on the map is drawn at range ÷ this factor; whether a city is reachable uses its road distance.
 */
export const roadFactor = 1.3;

export type Destination = {
  name: string;
  lat: number;
  lon: number;
  /** Approximate road distance from Pitești, in km. */
  roadKm: number;
  /** Where the label sits relative to the dot, to keep neighbours from overlapping. */
  label?: "left" | "right" | "top" | "bottom";
};

export const destinations: Destination[] = [
  { name: "Curtea de Argeș", lat: 45.1392, lon: 24.6792, roadKm: 38, label: "right" },
  { name: "Râmnicu Vâlcea", lat: 45.0997, lon: 24.3693, roadKm: 60, label: "left" },
  // The top of the Transfăgărășan, up the Argeș valley.
  { name: "Bâlea Lac", lat: 45.6043, lon: 24.6166, roadKm: 118, label: "bottom" },
  { name: "București", lat: 44.4268, lon: 26.1025, roadKm: 120, label: "right" },
  { name: "Craiova", lat: 44.3302, lon: 23.7949, roadKm: 122, label: "bottom" },
  { name: "Brașov", lat: 45.6427, lon: 25.5887, roadKm: 140, label: "right" },
  { name: "Sibiu", lat: 45.7983, lon: 24.1256, roadKm: 160, label: "left" },
  { name: "Târgu Mureș", lat: 46.5386, lon: 24.5575, roadKm: 285, label: "right" },
  { name: "Cluj-Napoca", lat: 46.7712, lon: 23.6236, roadKm: 330, label: "top" },
  { name: "Constanța", lat: 44.1598, lon: 28.6348, roadKm: 340, label: "left" },
  { name: "Galați", lat: 45.4353, lon: 28.008, roadKm: 355, label: "left" },
  { name: "Timișoara", lat: 45.7489, lon: 21.2087, roadKm: 430, label: "right" },
  { name: "Oradea", lat: 47.0465, lon: 21.9189, roadKm: 480, label: "right" },
  { name: "Suceava", lat: 47.6635, lon: 26.2732, roadKm: 500, label: "left" },
  { name: "Iași", lat: 47.1585, lon: 27.6014, roadKm: 510, label: "left" },
];
