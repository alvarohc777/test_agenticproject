/**
 * Feature registry: the menu and the routes come from this list.
 * Append-only: one import and one entry per feature, so parallel branches merge cleanly.
 */
import type { FeatureManifest } from "./feature";
import { feature as dashboard } from "../features/dashboard";
import { feature as report } from "../features/report";
import { feature as transactions } from "../features/transactions";
import { feature as alerts } from "../features/alerts";
import { feature as savings } from "../features/savings";
import { feature as invest } from "../features/invest";
import { feature as importCsv } from "../features/import";
import { feature as settings } from "../features/settings";

export const features: FeatureManifest[] = [
  dashboard,
  report,
  transactions,
  alerts,
  savings,
  invest,
  importCsv,
  settings,
].sort((a, b) => a.order - b.order);
