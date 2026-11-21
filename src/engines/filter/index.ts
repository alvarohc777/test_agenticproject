import type { Transaction } from "../../contracts";

/**
 * What the user can narrow the transaction list by. Every field is optional;
 * an empty filter returns everything.
 */
export type TransactionFilter = {
  /** First day included, "YYYY-MM-DD". For a single day, set from and to to the same date. */
  from?: string;
  /** Last day included, "YYYY-MM-DD". */
  to?: string;
  /** Category ids; empty or missing means all categories. */
  categories?: string[];
  /** "spending" = expenses; "income" = income and refunds. Transfers only appear with "all". */
  direction?: "all" | "spending" | "income";
  /** Lower bound of the absolute amount, in Rappen (inclusive). */
  minRappen?: number;
  /** Upper bound of the absolute amount, in Rappen (inclusive). */
  maxRappen?: number;
};

export function filterTransactions(transactions: Transaction[], f: TransactionFilter): Transaction[] {
  const cats = f.categories && f.categories.length > 0 ? new Set(f.categories) : null;
  return transactions.filter((t) => {
    if (f.from && t.date < f.from) return false;
    if (f.to && t.date > f.to) return false;
    if (cats && !cats.has(t.category ?? "other")) return false;
    if (f.direction === "spending" && t.kind !== "expense") return false;
    if (f.direction === "income" && t.kind !== "income" && t.kind !== "refund") return false;
    const abs = Math.abs(t.amountRappen);
    if (f.minRappen !== undefined && abs < f.minRappen) return false;
    if (f.maxRappen !== undefined && abs > f.maxRappen) return false;
    return true;
  });
}

/** Money in and out of a list, transfers excluded, both as positive Rappen. */
export function inOutTotals(transactions: Transaction[]): { inRappen: number; outRappen: number } {
  let inRappen = 0;
  let outRappen = 0;
  for (const t of transactions) {
    if (t.kind === "transfer") continue;
    if (t.amountRappen >= 0) inRappen += t.amountRappen;
    else outRappen -= t.amountRappen;
  }
  return { inRappen, outRappen };
}
