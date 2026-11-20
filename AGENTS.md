# AGENTS.md

Rules for every AI agent and human working in this repo. Tool-neutral; `CLAUDE.md` imports this file.

## What this is

A hackathon app for the PostFinance challenge "Beyond the List": turn a bank transaction list into insight (monthly report, a dashboard the user reshapes by asking, savings and investment ideas, alerts on suspicious payments) with an AI agent that explains and always asks before acting. Web first (GitHub Pages), Android later.

## Commands

- `npm install` once, then `npm run dev` for the app at http://localhost:5173
- `npm run check` before every pull request: typecheck, tests, build
- `npm test` for tests only; `npm run test:watch` while working

## Where things go

| Path | What | Rule |
| --- | --- | --- |
| `src/contracts/` | Types and interfaces | Frozen. Change only in a PR labelled `contract-change` |
| `src/engines/<name>/` | Pure logic: every number in the app | No UI, storage, network or LLM. Tests in `tests/engines/` |
| `src/adapters/<contract>/` | Implementations of contracts | Each must pass its suite in `tests/contracts/` |
| `src/composition.ts` | Picks one adapter per contract | The only file that imports adapters (exception: the import screen builds a CSV source from the user's files) |
| `src/agent/` | Prompts, explain, approval queue | Receives facts, never `Transaction[]` |
| `src/features/<id>/` | One screen: `index.ts` manifest + `Screen.tsx` | Register in `src/app/registry.ts` |
| `src/app/` | Shell, menu, routes, services context | Builds menu and routes from the registry |
| `src/shared/` | Money, i18n, small UI parts | No feature logic |
| `content/` | Merchants, categories, alternatives, products, shared strings, demo CSVs | Data, not code |
| `docs/` | Product, design, domain, architecture, templates | Frontmatter: type, sources, status, stale_after |
| `proxy/` | Serverless function holding the LLM key | Never import from `src/` |

## Rules that always hold

1. **Numbers come from engines, never from the LLM.** The agent puts computed facts into words.
2. **The agent always asks first.** Changes it proposes go into the approval queue; nothing changes until the user approves.
3. **Send summaries, not raw rows.** No account numbers or transaction lists in prompts.
4. **Money is integer Rappen** (`amountRappen`), formatted only in the UI with `formatChf`.
5. **No secrets in the repo, the chat or the Claude project.** Keys live in GitHub Secrets or the proxy host's environment.
6. **The challenge CSVs are not published.** Keep them in `data/samples/` (gitignored). Demo data in `content/demo/` is made up.
7. **Shared files are append-only:** `src/app/registry.ts`, `src/composition.ts`, `content/*.json`. Add one line; do not reorder or reformat.
8. **Feature strings live in the feature's manifest**, keyed by feature id; shared strings in `content/i18n/`.

## Data contract

`docs/domain/data-format.md` describes the CSV columns, the `Transaction` type and the known inconsistencies in the sample data. `src/engines/ingest` implements it; change both together.

## Workflow

- One branch per issue: `feat/12-csv-import`, `fix/30-refund-sign`. Short-lived.
- Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
- Pull request to `master` only; fill the template; CI must be green; one review; squash-merge.
- Label pull requests that are mostly generated `ai-assisted`.

## Definition of done

Tests for new engine logic, `npm run check` green, strings in both `en` and `de`, docs updated when a contract, a content file or the data format changes.

## Recipes

- New screen: `.claude/skills/add-feature/SKILL.md`
- New engine function: `.claude/skills/add-engine/SKILL.md`
