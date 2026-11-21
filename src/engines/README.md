---
type: module-readme
sources: [docs/architecture/overview.md, docs/domain/data-format.md]
status: draft
stale_after: 2026-12-31
---

# Engines

Pure functions that compute every number in the app. No UI, no storage, no network, no LLM. Each engine has tests in `tests/engines/`.

| Engine | Job | Status |
| --- | --- | --- |
| `ingest` | Read CSV exports, merge accounts, apply the data contract | Done, tested against fixtures and (locally) the challenge samples |
| `categorize` | Raw merchant ids → clean name + category, via `content/merchants.json` | Basic |
| `insights` | Monthly totals, spending by category; recurring payments next | Basic |
| `alerts` | Suspicious-payment rules; one rule so far (same-day repeats) | Basic |
| `savings` | Savings rate; cuts and cheaper alternatives next | Stub |
| `invest` | Match monthly surplus to products in `content/invest-products.json` | Stub |
| `report` | Facts for the written monthly report | Basic |
| `filter` | Narrow a transaction list by date, day, range, category, direction and amount; in/out totals | Done, tested |

Rules: inputs and outputs are plain data (`Transaction[]`, numbers in Rappen); engines may call other engines, never adapters or features.
