import type { Storage } from "../../contracts";
import { createMemoryStorage } from "./memory";

const PREFIX = "btl:";

/**
 * Device storage backed by localStorage. Falls back to memory where localStorage
 * is unavailable (private mode, some embedded views). Swap for IndexedDB or SQLite later.
 */
export function createLocalDbStorage(): Storage {
  let ls: globalThis.Storage;
  try {
    ls = globalThis.localStorage;
    ls.setItem(`${PREFIX}probe`, "1");
    ls.removeItem(`${PREFIX}probe`);
  } catch {
    return createMemoryStorage();
  }
  return {
    async get<T>(key: string) {
      const raw = ls.getItem(PREFIX + key);
      return raw === null ? undefined : (JSON.parse(raw) as T);
    },
    async set<T>(key: string, value: T) {
      ls.setItem(PREFIX + key, JSON.stringify(value));
    },
    async remove(key: string) {
      ls.removeItem(PREFIX + key);
    },
    async keys() {
      return Object.keys(ls)
        .filter((k) => k.startsWith(PREFIX))
        .map((k) => k.slice(PREFIX.length));
    },
  };
}
