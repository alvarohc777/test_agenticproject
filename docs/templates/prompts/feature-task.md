---
type: prompt-template
sources: [AGENTS.md]
status: draft
stale_after: 2026-12-31
---

# Prompt template: build a feature

Copy, fill the brackets, paste into Claude.

```
Issue: #[number] [title]
Goal: [what the user can do when this is done]
Feature folder: src/features/[id]/
Engines to use or extend: [names]
Acceptance: [2-4 checks a reviewer can run]
Constraints: follow AGENTS.md; use the add-feature skill; no contract changes; strings in en and de.
Finish with: npm run check, then open a pull request to master with the template filled.
```
