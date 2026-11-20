/**
 * Key-value storage on the device: settings, dashboard layout, approval queue.
 * Values must be JSON-serialisable. Nothing here leaves the device.
 */
export interface Storage {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  keys(): Promise<string[]>;
}
