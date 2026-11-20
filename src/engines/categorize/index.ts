import type { Transaction } from "../../contracts";

/** One entry of content/merchants.json: every raw id that means the same merchant. */
export type Merchant = { name: string; category: string; ids: string[] };

export const UNCATEGORISED = "other";

/**
 * Gives each transaction a clean counterparty name and a category, using the alias
 * list in content/merchants.json. Unknown merchants keep their name and get "other".
 */
export function categorize(transactions: Transaction[], merchants: Merchant[]): Transaction[] {
  const byId = new Map<string, Merchant>();
  for (const m of merchants) for (const id of m.ids) byId.set(id, m);

  return transactions.map((t) => {
    if (t.kind === "transfer") return { ...t, category: "transfer" };
    const m = byId.get(t.counterpartyId);
    return m
      ? { ...t, counterparty: m.name, category: m.category }
      : { ...t, category: t.kind === "income" ? "income" : UNCATEGORISED };
  });
}
