import type { FeatureManifest } from "../../app/feature";
import { Screen } from "./Screen";

export const feature: FeatureManifest = {
  id: "savings",
  order: 50,
  messages: {
    en: { title: "Savings", rate: "Share of income you kept" },
    de: { title: "Sparen", rate: "Anteil des Einkommens, der geblieben ist" },
  },
  Screen,
};
