import type { ComponentType } from "react";
import type { Messages } from "../shared/i18n";

/**
 * What a feature tells the app shell about itself. The shell builds the menu and
 * the routes from these manifests; it knows nothing else about features.
 */
export type FeatureManifest = {
  /** Folder name in src/features/, also the route: /#/<id>. */
  id: string;
  /** Position in the menu (lower first). */
  order: number;
  /** Strings for this feature; "title" is required. Keys become "<id>.<key>". */
  messages: Messages;
  Screen: ComponentType;
};

export function namespaced(features: FeatureManifest[]): Messages {
  const out: Messages = { en: {}, de: {} };
  for (const f of features) {
    for (const lang of ["en", "de"] as const) {
      for (const [k, v] of Object.entries(f.messages[lang])) out[lang][`${f.id}.${k}`] = v;
    }
  }
  return out;
}
