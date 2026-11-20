import type { Transaction } from "../../contracts";

export type MonthTotals = {
  /** "YYYY-MM" */
  month: string;
  incomeRappen: number;
  /** Spending net of refunds, as a positive number. */
  spendingRappen: number;
  refundsRappen: number;
};

const counts = (t: Transaction) => t.status === "settled" && t.kind !== "transfer";

/** Income and spending per month. Transfers and pending rows never count. */
export function monthlyTotals(transactions: Transaction[]): MonthTotals[] {
  const months = new Map<string, MonthTotals>();
  for (const t of transactions.filter(counts)) {
    const month = t.date.slice(0, 7);
    const m = months.get(month) ?? { month, incomeRappen: 0, spendingRappen: 0, refundsRappen: 0 };
    if (t.kind === "income") m.incomeRappen += t.amountRappen;
    if (t.kind === "expense") m.spendingRappen -= t.amountRappen;
    if (t.kind === "refund") {
      m.refundsRappen += t.amountRappen;
      m.spendingRappen -= t.amountRappen;
    }
    months.set(month, m);
  }
  return [...months.values()].sort((a, b) => a.month.localeCompare(b.month));
}

/** Net spending per category for one month ("YYYY-MM") or for everything. */
export function spendingByCategory(transactions: Transaction[], month?: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const t of transactions.filter(counts)) {
    if (t.kind === "income" || (month && !t.date.startsWith(month))) continue;
    const key = t.category ?? "other";
    out[key] = (out[key] ?? 0) - t.amountRappen;
  }
  return out;
}

// TODO(insights): recurring payments (rent on the 1st, salary on the 23rd...) and pay-cycle dates.
