import type { TransactionSource } from "../../contracts";

/** Placeholder for a live bank connection. Out of scope for the MVP. */
export function createBankApiSource(): TransactionSource {
  return {
    id: "bank-api",
    async load() {
      throw new Error("The bank API adapter is not implemented yet. Use the sample or CSV source.");
    },
  };
}
