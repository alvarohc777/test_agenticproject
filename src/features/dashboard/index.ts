import type { FeatureManifest } from "../../app/feature";
import { Screen } from "./Screen";

export const feature: FeatureManifest = {
  id: "dashboard",
  order: 10,
  messages: {
    en: { title: "Dashboard", months: "Income and spending", income: "Income", spending: "Spending", top: "Top spending this year", quality: "Data checks", rows: "transactions", flagged: "Rows to check" },
    de: { title: "Übersicht", months: "Einnahmen und Ausgaben", income: "Einnahmen", spending: "Ausgaben", top: "Grösste Ausgaben dieses Jahr", quality: "Datenprüfung", rows: "Buchungen", flagged: "Zu prüfende Zeilen" },
  },
  Screen,
};
