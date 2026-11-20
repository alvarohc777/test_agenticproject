import type { Notice, Notifier } from "../../contracts";

/** Writes notices to the console and keeps them for tests to inspect. */
export function createConsoleNotifier(): Notifier & { sent: Notice[] } {
  const sent: Notice[] = [];
  return {
    id: "console",
    sent,
    async notify(notice) {
      sent.push(notice);
      console.info(`[${notice.level}] ${notice.title}: ${notice.body}`);
    },
  };
}
