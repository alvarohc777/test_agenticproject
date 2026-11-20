---
name: add-feature
description: Add a new screen to the app (feature folder, manifest, registry entry, strings, test). Use when asked to create a screen, page or menu entry.
---

# Add a feature

1. Create `src/features/<id>/` with two files, copying the shape of `src/features/savings/`:
   - `index.ts`: `export const feature: FeatureManifest = { id, order, messages: { en: { title, ... }, de: { title, ... } }, Screen }`.
   - `Screen.tsx`: the UI. Get data with `useTransactions()` and services with `useServices()`; compute numbers with engines, never inline.
2. Pick `order` between the existing ones (multiples of 10) so the menu position is right.
3. Append one import and one list entry to `src/app/registry.ts`. Do not reorder other lines.
4. Strings: use `t("<id>.<key>")`; add every key in both `en` and `de` in the manifest. Category names use `t("category.<id>")`.
5. Money: `formatChf(rappen, locale)` from `src/shared/money.ts`.
6. If the screen needs new logic, add it to an engine first (see the add-engine skill) with tests.
7. Update the expected menu in `tests/app/shell.test.tsx`.
8. Run `npm run check`; open a pull request to `master` with the template filled.
