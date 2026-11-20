/**
 * Runs only where the real challenge exports exist locally in data/samples/
 * (gitignored: the challenge data is not published). CI skips it.
 * Expected numbers come from profiling the two 2025 sample files.
 */
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ingest } from "../../src/engines/ingest";
import { readText } from "../fixtures/load";

const dir = fileURLToPath(new URL("../../data/samples/", import.meta.url));
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".csv")).sort() : [];

describe.skipIf(files.length < 2)("ingest: challenge sample exports", () => {
  const { transactions, report } = ingest(
    files.map((f) => ({ text: readText(`data/samples/${f}`), fileName: f })),
  );

  it("reads every row of both accounts", () => {
    expect(report.rows).toBe(264 + 261);
  });

  it("merges the 12 card payments seen in both files", () => {
    expect(report.mirroredTransfersMerged).toBe(12);
    expect(transactions.filter((t) => t.kind === "transfer")).toHaveLength(12);
  });

  it("treats all 35 card income rows as refunds and keeps 13 salaries as income", () => {
    expect(report.refunds).toBe(35);
    expect(transactions.filter((t) => t.kind === "income")).toHaveLength(13);
  });

  it("flags the 13 unconverted EUR rows and the 12 rounded amounts", () => {
    expect(report.flagged).toEqual({ "unconverted-currency": 13, "rounded-amount": 12 });
  });

  it("gives every row a unique id", () => {
    expect(new Set(transactions.map((t) => t.id)).size).toBe(transactions.length);
  });
});
