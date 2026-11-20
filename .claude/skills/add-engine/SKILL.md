---
name: add-engine
description: Add or extend pure logic in src/engines (a calculation, a rule, a detection). Use when a screen or the agent needs a new number or fact.
---

# Add engine logic

1. Find the engine that owns the job (`src/engines/README.md`). Create a new engine folder only if none fits.
2. Write a pure function: inputs are plain data (`Transaction[]`, content JSON, numbers in Rappen); output is plain data. No React, storage, fetch or LLM.
3. Write the test first in `tests/engines/`. Use `demoFiles()` from `tests/fixtures/load.ts`, or add a small CSV to `tests/fixtures/` with the case you need and assert exact numbers.
4. Transfers and pending rows never count as spending or income.
5. If the agent will use the result, return facts (numbers, ids, short labels), not sentences.
6. Update the table in `src/engines/README.md` if the engine's status changes.
7. Run `npm run check`.
