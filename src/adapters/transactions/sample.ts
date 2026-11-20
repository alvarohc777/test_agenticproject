import type { TransactionSource } from "../../contracts";
import { ingest } from "../../engines/ingest";
import account1 from "../../../content/demo/account1.csv?raw";
import account3 from "../../../content/demo/account3.csv?raw";

/**
 * Bundled demo data: made-up rows in the challenge's CSV format (not the real samples,
 * which stay out of the repo). Used for the live demo and offline development.
 */
export function createSampleSource(): TransactionSource {
  return {
    id: "sample",
    async load() {
      return ingest([
        { text: account1, fileName: "account1.csv" },
        { text: account3, fileName: "account3.csv" },
      ]).transactions;
    },
  };
}
