/**
 * The dashboard is data: a list of widgets. The agent changes the dashboard by
 * proposing a new layout (src/agent/approval-queue.ts), never by changing code.
 */
export type WidgetType = "monthly-totals" | "top-categories" | "data-quality";
export type DashboardLayout = { version: 1; widgets: { type: WidgetType }[] };

export const defaultLayout: DashboardLayout = {
  version: 1,
  widgets: [{ type: "monthly-totals" }, { type: "top-categories" }, { type: "data-quality" }],
};
