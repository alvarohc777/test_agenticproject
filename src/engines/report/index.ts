import type { Transaction } from "../../contracts";
import { findAlerts } from "../alerts";
import { monthlyTotals, spendingByCategory } from "../insights";

/** Everything the written report may say about one month. The agent only phrases these facts. */
export type ReportFacts = {
  month: string;
  incomeRappen: number;
  spendingRappen: number;
  topCategories: { category: string; spendingRappen: number }[];
  alerts: number;
};

export function buildReportFacts(transactions: Transaction[], month: string): ReportFacts {
  const inMonth = transactions.filter((t) => t.date.startsWith(month));
  const totals = monthlyTotals(inMonth)[0];
  const topCategories = Object.entries(spendingByCategory(inMonth))
    .map(([category, spendingRappen]) => ({ category, spendingRappen }))
    .sort((a, b) => b.spendingRappen - a.spendingRappen)
    .slice(0, 3);
  return {
    month,
    incomeRappen: totals?.incomeRappen ?? 0,
    spendingRappen: totals?.spendingRappen ?? 0,
    topCategories,
    alerts: findAlerts(inMonth).length,
  };
}
