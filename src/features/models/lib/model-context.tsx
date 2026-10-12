"use client";

import { useTranslations } from "next-intl";
import { createContext, useContext, type ReactNode } from "react";
import type { ModelDefinition } from "../types";

const ModelContext = createContext<ModelDefinition | null>(null);

export function ModelProvider({ model, children }: { model: ModelDefinition; children: ReactNode }) {
  return <ModelContext.Provider value={model}>{children}</ModelContext.Provider>;
}

/** The model whose page is being rendered. */
export function useModel(): ModelDefinition {
  const model = useContext(ModelContext);
  if (!model) throw new Error("useModel must be used inside <ModelPage>");
  return model;
}

/** Translator scoped to the current model (`models.<model>.*`), taking the keys used in the data files. */
export function useModelText() {
  const { messagesKey } = useModel();
  const t = useTranslations(`models.${messagesKey}`);
  return (path: string) => t(path as never);
}
