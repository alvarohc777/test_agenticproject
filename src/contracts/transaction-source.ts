import type { Transaction } from "./transaction";

/**
 * Where transactions come from: bundled sample data, a CSV the user uploads,
 * or (later) a bank API. Every adapter returns normalised Transactions,
 * produced by engines/ingest, so nothing downstream knows the source.
 */
export interface TransactionSource {
  /** Short id shown in settings, for example "sample" or "csv". */
  readonly id: string;
  load(): Promise<Transaction[]>;
}
