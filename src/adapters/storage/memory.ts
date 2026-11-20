import type { Storage } from "../../contracts";

/** In-memory storage for tests and demos; forgets everything on reload. */
export function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    async get<T>(key: string) {
      const raw = data.get(key);
      return raw === undefined ? undefined : (JSON.parse(raw) as T);
    },
    async set<T>(key: string, value: T) {
      data.set(key, JSON.stringify(value));
    },
    async remove(key: string) {
      data.delete(key);
    },
    async keys() {
      return [...data.keys()];
    },
  };
}
