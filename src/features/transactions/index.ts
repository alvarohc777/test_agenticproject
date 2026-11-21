import type { FeatureManifest } from "../../app/feature";
import { Screen } from "./Screen";

export const feature: FeatureManifest = {
  id: "transactions",
  order: 30,
  messages: {
    en: {
      title: "Transactions", date: "Date", who: "Who", category: "Category", amount: "Amount",
      anyDate: "Any date", oneDay: "One day", range: "Date range", day: "Day", from: "From", to: "To",
      direction: "Type", all: "All", spending: "Spending", income: "Income",
      minChf: "Min CHF", maxChf: "Max CHF", reset: "Clear filters",
      of: "of", in: "Money in", out: "Money out", first: "showing the first", none: "No transactions match these filters.",
    },
    de: {
      title: "Buchungen", date: "Datum", who: "Wer", category: "Kategorie", amount: "Betrag",
      anyDate: "Alle Daten", oneDay: "Ein Tag", range: "Zeitraum", day: "Tag", from: "Von", to: "Bis",
      direction: "Art", all: "Alle", spending: "Ausgaben", income: "Einnahmen",
      minChf: "Min. CHF", maxChf: "Max. CHF", reset: "Filter löschen",
      of: "von", in: "Eingang", out: "Ausgang", first: "die ersten", none: "Keine Buchungen passen zu diesen Filtern.",
    },
  },
  Screen,
};
