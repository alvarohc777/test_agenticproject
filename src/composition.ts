/**
 * Composition root: the only file that picks concrete adapters.
 * Everything else receives the Services object and depends on contracts only.
 * Switch adapters with VITE_* variables (see .env.example). Append-only: one line per adapter.
 */
import type { LlmProvider, Notifier, Storage, TransactionSource } from "./contracts";
import { createBankApiSource } from "./adapters/transactions/bank-api";
import { createSampleSource } from "./adapters/transactions/sample";
import { createLocalDbStorage } from "./adapters/storage/local-db";
import { createMemoryStorage } from "./adapters/storage/memory";
import { createClaudeLlm } from "./adapters/llm/claude";
import { createFakeLlm } from "./adapters/llm/fake";
import { createLocalLlm } from "./adapters/llm/local";
import { createConsoleNotifier } from "./adapters/notifier/console";
import { createPushNotifier } from "./adapters/notifier/push";

export type AppConfig = {
  transactions: "sample" | "bank-api";
  storage: "memory" | "local-db";
  llm: "fake" | "claude" | "local";
  notifier: "console" | "push";
  proxyUrl?: string;
};

export type Services = {
  transactions: TransactionSource;
  storage: Storage;
  llm: LlmProvider;
  notifier: Notifier;
  config: AppConfig;
};

export const defaultConfig: AppConfig = {
  transactions: "sample",
  storage: "memory",
  llm: "fake",
  notifier: "console",
};

export function readConfig(env: Record<string, string | undefined> = import.meta.env): AppConfig {
  const pick = <K extends keyof AppConfig>(key: K, value: string | undefined, allowed: readonly string[]) =>
    (value && allowed.includes(value) ? value : defaultConfig[key]) as AppConfig[K];
  return {
    transactions: pick("transactions", env.VITE_TRANSACTIONS, ["sample", "bank-api"]),
    storage: pick("storage", env.VITE_STORAGE, ["memory", "local-db"]),
    llm: pick("llm", env.VITE_LLM, ["fake", "claude", "local"]),
    notifier: pick("notifier", env.VITE_NOTIFIER, ["console", "push"]),
    proxyUrl: env.VITE_PROXY_URL || undefined,
  };
}

export function compose(config: AppConfig = readConfig()): Services {
  const transactions = {
    sample: createSampleSource,
    "bank-api": createBankApiSource,
  }[config.transactions]();

  const storage = {
    memory: createMemoryStorage,
    "local-db": createLocalDbStorage,
  }[config.storage]();

  const llm =
    config.llm === "claude" && config.proxyUrl
      ? createClaudeLlm(config.proxyUrl)
      : config.llm === "local"
        ? createLocalLlm()
        : createFakeLlm();

  const notifier = {
    console: createConsoleNotifier,
    push: createPushNotifier,
  }[config.notifier]();

  return { transactions, storage, llm, notifier, config };
}
