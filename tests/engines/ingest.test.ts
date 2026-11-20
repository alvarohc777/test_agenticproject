import { describe, expect, it } from "vitest";
import { CsvFormatError, ingest, parseCsv } from "../../src/engines/ingest";
import { demoFiles, readText } from "../fixtures/load";

describe("parseCsv", () => {
  it("handles quoted commas, escaped quotes, CRLF and a BOM", () => {
    const rows = parseCsv('﻿a,b\r\n"x, y","say ""hi"""\r\n');
    expect(rows).toEqual([
      ["a", "b"],
      ["x, y", 'say "hi"'],
    ]);
  });
});

describe("ingest: demo exports (data contract)", () => {
  const { transactions, report } = ingest(demoFiles());

  it("detects both accounts and their labels", () => {
    expect(report.files.map((f) => [f.accountId, f.accountLabel])).toEqual([
      ["Account1", "Privatkonto"],
      ["Account3", "KK-Konto"],
    ]);
  });

  it("keeps card payments once, as transfers", () => {
    expect(report.mirroredTransfersMerged).toBe(3);
    const transfers = transactions.filter((t) => t.kind === "transfer");
    expect(transfers).toHaveLength(3);
    expect(transfers.every((t) => t.accountId === "Account1" && t.amountRappen < 0)).toBe(true);
    expect(report.transactions).toBe(report.rows - 3);
  });

  it("turns income from a shop into a refund", () => {
    const refund = transactions.find((t) => t.kind === "refund");
    expect(refund?.counterpartyId).toBe("Zalando");
    expect(refund?.amountRappen).toBe(7990);
    expect(transactions.filter((t) => t.kind === "income").every((t) => t.counterpartyId === "EmployerAG")).toBe(true);
  });

  it("uses the CHF base amount, rounds to Rappen and flags unconverted currency", () => {
    const amazon = transactions.find((t) => t.counterpartyId === "Amazon");
    expect(amazon?.amountRappen).toBe(-5280);
    expect(amazon?.original).toEqual({ amount: 52.7992453246534, currency: "EUR" });
    expect(amazon?.flags).toEqual(["unconverted-currency", "rounded-amount"]);
    expect(report.flagged).toEqual({ "unconverted-currency": 1, "rounded-amount": 1 });
  });

  it("keeps identical same-day rows as separate transactions", () => {
    const sbb = transactions.filter((t) => t.counterpartyId === "SBB_CFF_FSS_Ticket_Shop");
    expect(sbb).toHaveLength(2);
    expect(sbb[0]!.id).not.toBe(sbb[1]!.id);
  });
});

describe("ingest: edge cases", () => {
  const { transactions } = ingest([{ text: readText("tests/fixtures/edge-cases.csv") }]);

  it("keeps two salaries with the same date, amount and payer (the name differs)", () => {
    expect(transactions.filter((t) => t.kind === "income")).toHaveLength(2);
  });

  it("reads quoted names and labels with commas", () => {
    const pizza = transactions.find((t) => t.counterpartyId === "PIZZERIA_&_GRIL,_Samedan");
    expect(pizza?.counterparty).toBe("Pizzeria & Grill, Samedan");
    expect(pizza?.amountRappen).toBe(-24240);
  });

  it("marks anything not settled as pending", () => {
    expect(transactions.find((t) => t.counterpartyId === "QuoteShop")?.status).toBe("pending");
  });

  it("rejects files without the expected columns", () => {
    expect(() => ingest([{ text: "foo,bar\n1,2\n" }])).toThrow(CsvFormatError);
  });
});
