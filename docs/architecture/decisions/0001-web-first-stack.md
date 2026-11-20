---
type: decision
sources: [team planning doc (Technical tab, stack options)]
status: proposed
stale_after: 2026-12-31
---

# 0001: Web first with Vite, React and TypeScript

## Context

The team needs a live demo on GitHub Pages from the first day and an Android app at the end, without a late migration. The planning doc lists two options: Expo (React Native with web export) or a web app wrapped with Capacitor.

## Decision (proposed, to confirm as a team)

Vite + React + TypeScript, deployed to GitHub Pages. Android later through Capacitor, wrapping the same build. Hash routing so Pages needs no 404 fallback.

## Consequences

- One codebase, plain web skills, fast CI.
- Native features (notifications, file access) come through Capacitor plugins.
- If the team picks Expo instead, contracts, engines, content and tests carry over unchanged; only `src/app/`, `src/features/` and `src/shared/ui.tsx` change.
