import { describe, expect, it } from "vitest";
import merchantsFile from "../../content/merchants.json";
import { categorize } from "../../src/engines/categorize";
import { filterTransactions, inOutTotals } from "../../src/engines/filter";
import { ingest } from "../../src/engines/ingest";
import { demoFiles } from "../fixtures/load";

const txs = categorize(ingest(demoFiles()).transactions, merchantsFile.merchants);

describe("filterTransactions", () => {
  it("returns everything for an empty filter", () => {
    expect(filterTransactions(txs, {})).toHaveLength(txs.length);
  });

  it("filters one day when from and to are the same", () => {
    const day = filterTransactions(txs, { from: "2025-02-14", to: "2025-02-14" });
    expect(day.length).toBeGreaterThan(0);
    expect(day.every((t) => t.date === "2025-02-14")).toBe(true);
  });

  it("filters an inclusive date range", () => {
    const feb = filterTransactions(txs, { from: "2025-02-01", to: "2025-02-28" });
    expect(feb.every((t) => t.date.startsWith("2025-02"))).toBe(true);
    expect(feb).toHaveLength(txs.filter((t) => t.date.startsWith("2025-02")).length);
  });

  it("filters by several categories", () => {
    const r = filterTransactions(txs, { categories: ["books", "groceries"] });
    expect(new Set(r.map((t) => t.category))).toEqual(new Set(["books", "groceries"]));
  });

  it("separates spending from income, and leaves transfers out of both", () => {
    const spending = filterTransactions(txs, { direction: "spending" });
    const income = filterTransactions(txs, { direction: "income" });
    expect(spending.every((t) => t.kind === "expense")).toBe(true);
    expect(income.map((t) => t.kind).sort()).toEqual(["income", "income", "income", "refund"]);
  });

  it("filters by absolute amount, bounds included", () => {
    const r = filterTransactions(txs, { minRappen: 1650_00, maxRappen: 6200_00 });
    expect(r.every((t) => Math.abs(t.amountRappen) >= 165000 && Math.abs(t.amountRappen) <= 620000)).toBe(true);
    expect(r.some((t) => t.counterparty === "Rent")).toBe(true);
    expect(r.some((t) => t.counterparty === "Employer AG")).toBe(true);
  });

  it("combines all criteria", () => {
    const r = filterTransactions(txs, { from: "2025-03-01", to: "2025-03-31", direction: "spending", categories: ["housing"] });
    expect(r).toHaveLength(1);
    expect(r[0]!.amountRappen).toBe(-165000);
  });
});

describe("inOutTotals", () => {
  it("sums money in and out, without transfers", () => {
    const feb = filterTransactions(txs, { from: "2025-02-01", to: "2025-02-28" });
    const { inRappen, outRappen } = inOutTotals(feb);
    expect(inRappen).toBe(620000 + 7990);
    const out = feb.filter((t) => t.kind === "expense").reduce((n, t) => n - t.amountRappen, 0);
    expect(outRappen).toBe(out);
  });
});
