import { describe, expect, it } from "vitest";
import merchantsFile from "../../content/merchants.json";
import { findAlerts } from "../../src/engines/alerts";
import { categorize } from "../../src/engines/categorize";
import { ingest } from "../../src/engines/ingest";
import { monthlyTotals, spendingByCategory } from "../../src/engines/insights";
import { investmentIdeas } from "../../src/engines/invest";
import { buildReportFacts } from "../../src/engines/report";
import { savingsRate } from "../../src/engines/savings";
import { demoFiles } from "../fixtures/load";

const txs = categorize(ingest(demoFiles()).transactions, merchantsFile.merchants);

describe("categorize", () => {
  it("merges merchant aliases into one clean name", () => {
    const books = txs.filter((t) => t.counterpartyId === "OrellFuessli" || t.counterpartyId === "Orell_Füssli");
    expect(new Set(books.map((t) => t.counterparty))).toEqual(new Set(["Orell Füssli"]));
    expect(books.every((t) => t.category === "books")).toBe(true);
  });

  it("falls back to 'other' for unknown merchants", () => {
    expect(txs.find((t) => t.counterpartyId === "Ristorante_Luce")?.category).toBe("other");
  });
});

describe("insights", () => {
  it("adds up income per month without transfers", () => {
    const months = monthlyTotals(txs);
    expect(months.map((m) => m.month)).toEqual(["2025-01", "2025-02", "2025-03"]);
    expect(months.every((m) => m.incomeRappen === 620000)).toBe(true);
  });

  it("nets refunds against spending", () => {
    const feb = monthlyTotals(txs).find((m) => m.month === "2025-02")!;
    expect(feb.refundsRappen).toBe(7990);
    const clothing = spendingByCategory(txs, "2025-02").clothing ?? 0;
    const zalandoFeb = txs.filter((t) => t.counterpartyId === "Zalando" && t.date.startsWith("2025-02"));
    expect(clothing).toBe(-zalandoFeb.reduce((n, t) => n + t.amountRappen, 0));
  });
});

describe("alerts", () => {
  it("flags the two identical SBB tickets on the same day", () => {
    const alerts = findAlerts(txs);
    expect(alerts).toHaveLength(1);
    expect(alerts[0]!.facts).toMatchObject({ date: "2025-02-14", count: 2, amountRappen: 6400 });
  });
});

describe("savings, invest, report", () => {
  it("computes a savings rate between 0 and 1", () => {
    const rate = savingsRate(txs)!;
    expect(rate).toBeGreaterThan(0);
    expect(rate).toBeLessThan(1);
  });

  it("suggests nothing without a surplus or without products", () => {
    expect(investmentIdeas(0, [])).toEqual([]);
    expect(investmentIdeas(50000, [])).toEqual([]);
  });

  it("builds report facts for one month", () => {
    const facts = buildReportFacts(txs, "2025-02");
    expect(facts.incomeRappen).toBe(620000);
    expect(facts.topCategories[0]?.category).toBe("housing");
    expect(facts.alerts).toBe(1);
  });
});
