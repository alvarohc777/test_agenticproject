import type { Transaction } from "../../contracts";

export type Alert = {
  id: string;
  rule: "same-day-repeat";
  transactionIds: string[];
  /** Facts for the screen or the agent to put into words; no prose here. */
  facts: Record<string, string | number>;
};

/**
 * Flags payments the user may want to check. The user approves or escalates;
 * this engine never blocks anything.
 */
export function findAlerts(transactions: Transaction[]): Alert[] {
  const groups = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (t.kind !== "expense") continue;
    const key = [t.accountId, t.date, t.counterpartyId, t.amountRappen].join("|");
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }
  return [...groups.entries()]
    .filter(([, ts]) => ts.length > 1)
    .map(([key, ts]) => ({
      id: `same-day-repeat:${key}`,
      rule: "same-day-repeat" as const,
      transactionIds: ts.map((t) => t.id),
      facts: {
        date: ts[0]!.date,
        counterparty: ts[0]!.counterparty,
        count: ts.length,
        amountRappen: -ts[0]!.amountRappen,
      },
    }));
}

// TODO(alerts): unusual amount for a merchant, new merchant abroad, refund that does not match its charge.
