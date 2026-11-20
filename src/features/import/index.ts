import type { FeatureManifest } from "../../app/feature";
import { Screen } from "./Screen";

export const feature: FeatureManifest = {
  id: "import",
  order: 70,
  messages: {
    en: { title: "Import CSV", pick: "Choose your PostFinance CSV exports (one per account). They stay on this device.", rows: "Rows", accounts: "Accounts", merged: "Card payments merged", flagged: "Rows to check", use: "Use these files" },
    de: { title: "CSV importieren", pick: "Wähle deine PostFinance-CSV-Exporte (einer pro Konto). Sie bleiben auf diesem Gerät.", rows: "Zeilen", accounts: "Konten", merged: "Kreditkartenzahlungen zusammengeführt", flagged: "Zu prüfende Zeilen", use: "Diese Dateien verwenden" },
  },
  Screen,
};
