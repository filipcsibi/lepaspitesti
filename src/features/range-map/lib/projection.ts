import { romaniaOutline } from "../data/romania-outline";

/**
 * Flat projection of Romania where one map unit is one kilometre,
 * so a range in km can be drawn directly as a circle radius.
 */
const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LON = 111.32 * Math.cos((46 * Math.PI) / 180);

const lons = romaniaOutline.map(([lon]) => lon);
const lats = romaniaOutline.map(([, lat]) => lat);
const west = Math.min(...lons);
const north = Math.max(...lats);

/** Empty space around the country, in km. */
const PADDING = 40;

export function project(lon: number, lat: number): [number, number] {
  return [(lon - west) * KM_PER_DEG_LON + PADDING, (north - lat) * KM_PER_DEG_LAT + PADDING];
}

export const mapSize = {
  width: Math.round((Math.max(...lons) - west) * KM_PER_DEG_LON + PADDING * 2),
  height: Math.round((north - Math.min(...lats)) * KM_PER_DEG_LAT + PADDING * 2),
};

export const outlinePath =
  romaniaOutline
    .map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("") + "Z";
