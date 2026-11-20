---
type: module-readme
sources: [AGENTS.md, docs/architecture/overview.md]
status: draft
stale_after: 2026-12-31
---

# Agent

The AI layer. It explains, suggests and asks; it never computes numbers and never changes anything on its own.

- `prompts.ts`: the system prompt with the agent rules.
- `explain.ts`: engine facts in, short text out. Accepts facts types only, never `Transaction[]`.
- `approval-queue.ts`: proposals (dashboard layout, category fix, savings goal) wait here until the user approves.
- Next: `tools.ts`, the list of engine functions the agent may call, each returning facts.
