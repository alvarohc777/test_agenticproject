import { vi } from "vitest";
import { createCsvSource } from "../../src/adapters/transactions/csv";
import { createSampleSource } from "../../src/adapters/transactions/sample";
import { createLocalDbStorage } from "../../src/adapters/storage/local-db";
import { createMemoryStorage } from "../../src/adapters/storage/memory";
import { createFakeLlm } from "../../src/adapters/llm/fake";
import { createConsoleNotifier } from "../../src/adapters/notifier/console";
import { demoFiles } from "../fixtures/load";
import { llmProviderSuite, notifierSuite, storageSuite, transactionSourceSuite } from "./suites";

vi.spyOn(console, "info").mockImplementation(() => {});

transactionSourceSuite("sample", createSampleSource);
transactionSourceSuite("csv", () => createCsvSource(demoFiles()));

storageSuite("memory", createMemoryStorage);
storageSuite("local-db (falls back to memory without localStorage)", createLocalDbStorage);

llmProviderSuite("fake", createFakeLlm);

notifierSuite("console", createConsoleNotifier);
