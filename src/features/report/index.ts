import type { FeatureManifest } from "../../app/feature";
import { Screen } from "./Screen";

export const feature: FeatureManifest = {
  id: "report",
  order: 20,
  messages: {
    en: { title: "Monthly report", write: "Write the summary", facts: "Facts from the engines", income: "Income", spending: "Spending" },
    de: { title: "Monatsbericht", write: "Zusammenfassung schreiben", facts: "Fakten aus den Engines", income: "Einnahmen", spending: "Ausgaben" },
  },
  Screen,
};
