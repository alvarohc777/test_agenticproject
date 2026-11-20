/**
 * The one shape every transactions adapter delivers. Frozen: change it only in a
 * pull request labelled `contract-change`, with the data-format doc updated.
 * See docs/domain/data-format.md for how each CSV column maps here.
 */

export type TransactionKind = "expense" | "income" | "transfer" | "refund";

/** Problems found in the source data; engines and screens may show them. */
export type DataFlag =
  /** Foreign currency booked with exchange rate 1.0, so the CHF amount is not converted. */
  | "unconverted-currency"
  /** Amount had more than two decimals and was rounded to Rappen. */
  | "rounded-amount";

export type Transaction = {
  /** Stable hash of account, date, amount and raw name (unique within one import). */
  id: string;
  /** Our account this row belongs to, for example "Account1". */
  accountId: string;
  /** Booking date, ISO "YYYY-MM-DD" (transaction_date in the CSV). */
  date: string;
  /** Signed amount in CHF Rappen: -182000 is 1,820.00 CHF going out. */
  amountRappen: number;
  kind: TransactionKind;
  /** Readable name of the other side, as delivered (cleaned later by engines/categorize). */
  counterparty: string;
  /** Raw id of the other side, used for alias matching. */
  counterpartyId: string;
  /** Free text from the bank, kept for display and search; never parse dates from it. */
  rawName: string;
  /** Set by engines/categorize. */
  category?: string;
  /** Present when the original currency differs from CHF. */
  original?: { amount: number; currency: string };
  status: "settled" | "pending";
  flags?: DataFlag[];
};
