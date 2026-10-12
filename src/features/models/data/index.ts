import type { ModelDefinition } from "../types";
import { lepasL4 } from "./lepas-l4";
import { lepasL6Bev } from "./lepas-l6-bev";
import { lepasL6Phev } from "./lepas-l6-phev";
import { lepasL8 } from "./lepas-l8";

/** All model pages. Add a new model by creating a data file and listing it here. */
export const models: ModelDefinition[] = [lepasL8, lepasL6Phev, lepasL6Bev, lepasL4];

export function getModel(slug: string): ModelDefinition | undefined {
  return models.find((m) => m.slug === slug);
}
