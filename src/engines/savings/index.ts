import type { Transaction } from "../../contracts";
import { monthlyTotals } from "../insights";

/** One entry of content/alternatives.json. */
export type Alternative = { category: string; from: string; to: string; note?: string };

/** Share of income kept over all months, between 0 and 1 (null without income). */
export function savingsRate(transactions: Transaction[]): number | null {
  const months = monthlyTotals(transactions);
  const income = months.reduce((n, m) => n + m.incomeRappen, 0);
  const spending = months.reduce((n, m) => n + m.spendingRappen, 0);
  return income > 0 ? (income - spending) / income : null;
}

// TODO(savings): cut suggestions per category and matches against content/alternatives.json.
