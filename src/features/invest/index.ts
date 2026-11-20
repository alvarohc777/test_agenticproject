import type { FeatureManifest } from "../../app/feature";
import { Screen } from "./Screen";

export const feature: FeatureManifest = {
  id: "invest",
  order: 60,
  messages: {
    en: { title: "Investment ideas" },
    de: { title: "Anlageideen" },
  },
  Screen,
};
