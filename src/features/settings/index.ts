import type { FeatureManifest } from "../../app/feature";
import { Screen } from "./Screen";

export const feature: FeatureManifest = {
  id: "settings",
  order: 80,
  messages: {
    en: { title: "Settings", language: "Language", adapters: "Adapters in use" },
    de: { title: "Einstellungen", language: "Sprache", adapters: "Verwendete Adapter" },
  },
  Screen,
};
