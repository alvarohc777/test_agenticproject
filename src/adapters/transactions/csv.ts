import type { TransactionSource } from "../../contracts";
import { ingest, type ImportFile } from "../../engines/ingest";

/** CSV exports the user picked on the import screen. Parsed on the device only. */
export function createCsvSource(files: ImportFile[]): TransactionSource {
  return {
    id: "csv",
    async load() {
      return ingest(files).transactions;
    },
  };
}
