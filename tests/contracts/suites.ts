/**
 * One reusable suite per contract. Every adapter must pass the suite of its contract:
 * add a line in adapters.test.ts when you add an adapter.
 */
import { describe, expect, it } from "vitest";
import type { LlmProvider, Notifier, Storage, TransactionSource } from "../../src/contracts";

export function transactionSourceSuite(name: string, make: () => TransactionSource) {
  describe(`TransactionSource contract: ${name}`, () => {
    it("loads transactions with the contract fields", async () => {
      const txs = await make().load();
      expect(txs.length).toBeGreaterThan(0);
      for (const t of txs) {
        expect(t.id).toMatch(/^[0-9a-f]{8}$/);
        expect(t.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isInteger(t.amountRappen)).toBe(true);
        expect(["expense", "income", "transfer", "refund"]).toContain(t.kind);
        expect(["settled", "pending"]).toContain(t.status);
      }
    });

    it("gives every transaction a unique id", async () => {
      const txs = await make().load();
      expect(new Set(txs.map((t) => t.id)).size).toBe(txs.length);
    });

    it("signs money out as negative and money in as positive", async () => {
      const txs = await make().load();
      for (const t of txs) {
        if (t.kind === "expense") expect(t.amountRappen).toBeLessThan(0);
        if (t.kind === "income" || t.kind === "refund") expect(t.amountRappen).toBeGreaterThan(0);
      }
    });
  });
}

export function storageSuite(name: string, make: () => Storage) {
  describe(`Storage contract: ${name}`, () => {
    it("round-trips JSON values and lists keys", async () => {
      const s = make();
      await s.set("a", { n: 1, list: [1, 2] });
      expect(await s.get("a")).toEqual({ n: 1, list: [1, 2] });
      expect(await s.keys()).toContain("a");
    });

    it("returns undefined for missing or removed keys", async () => {
      const s = make();
      expect(await s.get("missing")).toBeUndefined();
      await s.set("b", 1);
      await s.remove("b");
      expect(await s.get("b")).toBeUndefined();
    });
  });
}

export function llmProviderSuite(name: string, make: () => LlmProvider) {
  describe(`LlmProvider contract: ${name}`, () => {
    it("answers with text", async () => {
      const res = await make().complete({ messages: [{ role: "user", content: "Hello" }] });
      expect(typeof res.text).toBe("string");
      expect(res.text.length).toBeGreaterThan(0);
    });
  });
}

export function notifierSuite(name: string, make: () => Notifier) {
  describe(`Notifier contract: ${name}`, () => {
    it("accepts a notice without throwing", async () => {
      await expect(make().notify({ title: "Test", body: "Body", level: "info" })).resolves.toBeUndefined();
    });
  });
}
