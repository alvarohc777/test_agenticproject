---
type: architecture
sources: [team planning doc (Technical tab), context notes 20.11.26]
status: draft
stale_after: 2026-12-31
---

# Architecture overview

## Layers

| Layer | Folder | Depends on |
| --- | --- | --- |
| Contracts | `src/contracts/` | nothing |
| Engines | `src/engines/` | contracts, other engines |
| Adapters | `src/adapters/` | contracts, engines (ingest) |
| Agent | `src/agent/` | contracts, engine fact types |
| Features | `src/features/` | app services, engines, shared, agent |
| App shell | `src/app/` | registry, shared |
| Composition | `src/composition.ts` | adapters |

Features never import adapters; they get services from `useServices()`. Only `composition.ts` knows concrete adapters (the import screen is the one exception: it builds a CSV source from the user's files).

## Engines

| Engine | Job | Used by |
| --- | --- | --- |
| ingest | Read the CSV exports, merge accounts, apply the data contract | every other engine |
| categorize | Messy merchant ids → one clean name and a category | insights, savings, dashboard |
| insights | Monthly totals, spending by category; recurring payments next | dashboard, report |
| alerts | Flag suspicious payments; the user approves or escalates | alerts screen |
| savings | Savings rate; cuts and cheaper alternatives next | savings screen, report |
| invest | Match surplus to products in `content/invest-products.json` | invest screen, report |
| report | Facts for the written monthly report | agent, report screen |

## Contracts and adapters

| Contract | Adapters | Default |
| --- | --- | --- |
| TransactionSource | sample (demo CSVs), csv (user upload), bank-api (later) | sample |
| Storage | memory, local-db (localStorage) | memory |
| LlmProvider | fake, claude (through `proxy/`), local (later) | fake |
| Notifier | console, push | console |

## Rules

- Numbers come from engines, never from the LLM.
- The agent always asks first (approval queue).
- Send summaries, not raw rows.
- The dashboard is data: a JSON layout the agent proposes changes to.
