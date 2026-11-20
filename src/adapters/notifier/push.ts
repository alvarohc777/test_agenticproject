import type { Notifier } from "../../contracts";
import { createConsoleNotifier } from "./console";

/**
 * Browser notifications when allowed; console otherwise.
 * TODO(notifier): native push through Capacitor once the Android build exists.
 */
export function createPushNotifier(): Notifier {
  const fallback = createConsoleNotifier();
  return {
    id: "push",
    async notify(notice) {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(notice.title, { body: notice.body });
        return;
      }
      await fallback.notify(notice);
    },
  };
}
