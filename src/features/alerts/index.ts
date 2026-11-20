import type { FeatureManifest } from "../../app/feature";
import { Screen } from "./Screen";

export const feature: FeatureManifest = {
  id: "alerts",
  order: 40,
  messages: {
    en: { title: "Alerts", repeat: "Same payment several times on one day", none: "No alerts." },
    de: { title: "Warnungen", repeat: "Gleiche Zahlung mehrmals am selben Tag", none: "Keine Warnungen." },
  },
  Screen,
};
