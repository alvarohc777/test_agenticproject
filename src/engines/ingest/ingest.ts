import type { DataFlag, Transaction, TransactionKind } from "../../contracts";
import { readRows, type RawRow } from "./csv";

export type ImportFile = {
  text: string;
  /** Our account in this file. Detected when omitted: the id present in every row. */
  accountId?: string;
  fileName?: string;
};

export type IngestReport = {
  files: { fileName?: string; accountId: string; accountLabel: string; rows: number }[];
  rows: number;
  transactions: number;
  /** Transfers between two imported accounts, seen in both files and kept once. */
  mirroredTransfersMerged: number;
  refunds: number;
  flagged: Record<DataFlag, number>;
};

export type IngestResult = { transactions: Transaction[]; report: IngestReport };

const CARD_LABEL = /\bKK\b|kredit|credit/i;
const REFUND_NAME = /refund|r[üu]ckerstattung|gutschrift/i;

/**
 * Turns one or more bank exports into Transactions, applying the data contract
 * (docs/domain/data-format.md). Pure: no UI, storage or network.
 */
export function ingest(files: ImportFile[]): IngestResult {
  const parsed = files.map((f) => {
    const rows = readRows(f.text);
    const accountId = f.accountId ?? detectAccount(rows);
    return { ...f, rows, accountId, accountLabel: labelOf(rows, accountId) };
  });
  const ourAccounts = new Set(parsed.map((p) => p.accountId));
  const expensePayees = new Set(
    parsed.flatMap((p) => p.rows.filter((r) => r.type === "expense").map((r) => r.target_id)),
  );

  // Transfers between two imported accounts appear in both files: keep the sender's copy.
  const transferKey = (r: RawRow) =>
    [r.transaction_date, r.base_amount, r.source_id, r.target_id, r.name].join("|");
  const senderTransfers = new Set(
    parsed.flatMap((p) =>
      p.rows.filter((r) => r.type === "transfer" && r.source_id === p.accountId).map(transferKey),
    ),
  );

  const transactions: Transaction[] = [];
  const seenIds = new Set<string>();
  let mirrored = 0;

  for (const file of parsed) {
    const isCard = CARD_LABEL.test(file.accountLabel);
    for (const r of file.rows) {
      const outgoing = r.source_id === file.accountId;
      const otherId = outgoing ? r.target_id : r.source_id;
      const isTransfer = r.type === "transfer" || (ourAccounts.has(otherId) && otherId !== file.accountId);

      if (isTransfer && !outgoing && ourAccounts.has(r.source_id) && senderTransfers.has(transferKey(r))) {
        mirrored++;
        continue;
      }

      const kind: TransactionKind = isTransfer
        ? "transfer"
        : r.type === "income"
          ? isCard || REFUND_NAME.test(r.name) || expensePayees.has(otherId)
            ? "refund"
            : "income"
          : "expense";

      const base = Number(r.base_amount);
      const amountRappen = Math.round(base * 100) * (outgoing ? -1 : 1);
      const flags: DataFlag[] = [];
      if (r.currency !== r.base_currency && Number(r.exchange_rate) === 1) flags.push("unconverted-currency");
      if (decimals(r.base_amount) > 2) flags.push("rounded-amount");

      let id = hash([file.accountId, r.transaction_date, r.base_amount, r.name].join("|"));
      for (let n = 2; seenIds.has(id); n++) id = hash(`${id}|${n}`);
      seenIds.add(id);

      transactions.push({
        id,
        accountId: file.accountId,
        date: r.transaction_date,
        amountRappen,
        kind,
        counterparty: outgoing ? r.target_label : r.source_label,
        counterpartyId: otherId,
        rawName: r.name,
        ...(r.currency !== r.base_currency
          ? { original: { amount: Number(r.amount), currency: r.currency } }
          : {}),
        status: r.status === "settled" ? "settled" : "pending",
        ...(flags.length > 0 ? { flags } : {}),
      });
    }
  }

  transactions.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const count = (flag: DataFlag) => transactions.filter((t) => t.flags?.includes(flag)).length;

  return {
    transactions,
    report: {
      files: parsed.map((p) => ({
        fileName: p.fileName,
        accountId: p.accountId,
        accountLabel: p.accountLabel,
        rows: p.rows.length,
      })),
      rows: parsed.reduce((n, p) => n + p.rows.length, 0),
      transactions: transactions.length,
      mirroredTransfersMerged: mirrored,
      refunds: transactions.filter((t) => t.kind === "refund").length,
      flagged: { "unconverted-currency": count("unconverted-currency"), "rounded-amount": count("rounded-amount") },
    },
  };
}

/** The account of an export is the id that appears in every row. */
function detectAccount(rows: RawRow[]): string {
  const counts = new Map<string, number>();
  for (const r of rows) {
    for (const id of new Set([r.source_id, r.target_id])) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!best) throw new Error("Cannot detect the account: the file has no rows.");
  return best[0];
}

function labelOf(rows: RawRow[], accountId: string): string {
  const r = rows.find((x) => x.source_id === accountId || x.target_id === accountId);
  if (!r) return accountId;
  return r.source_id === accountId ? r.source_label : r.target_label;
}

function decimals(value: string): number {
  const dot = value.indexOf(".");
  return dot === -1 ? 0 : value.length - dot - 1;
}

/** FNV-1a, 32 bit, as 8 hex chars: stable ids without a crypto dependency. */
function hash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
