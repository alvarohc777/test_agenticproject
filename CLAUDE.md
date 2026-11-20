@AGENTS.md

## Claude-specific notes

- Skills for recurring tasks live in `.claude/skills/` (add-feature, add-engine). Use them instead of improvising the structure.
- Before changing anything in `src/contracts/`, stop and ask: contract changes need the integrator's approval.
- Run `npm run check` before saying a task is done, and report the result.
- Work on a branch and open a pull request; never push to `master`.
