import type { FeatureManifest } from "../../app/feature";
import { Screen } from "./Screen";

export const feature: FeatureManifest = {
  id: "transactions",
  order: 30,
  messages: {
    en: { title: "Transactions", date: "Date", who: "Who", category: "Category", amount: "Amount", latest: "Latest 50 of" },
    de: { title: "Buchungen", date: "Datum", who: "Wer", category: "Kategorie", amount: "Betrag", latest: "Neueste 50 von" },
  },
  Screen,
};
