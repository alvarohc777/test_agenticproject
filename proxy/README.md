---
type: module-readme
sources: [AGENTS.md]
status: draft
stale_after: 2026-12-31
---

# LLM proxy

GitHub Pages only serves static files, so the app cannot hold an API key. This small function does: the app sends `{ system, messages, maxTokens }`, the proxy adds the key, calls the model and returns `{ text }`.

- `worker.ts` is written for Cloudflare Workers; the same code fits Vercel or Netlify functions with a small wrapper.
- Set `ANTHROPIC_API_KEY`, `ALLOWED_ORIGIN` (the Pages URL) and optionally `MODEL` in the host's settings. Never commit them.
- In the app, set `VITE_LLM=claude` and `VITE_PROXY_URL=<deployed URL>`.
- Not part of the app build or its typecheck; deploy it separately once the team decides on the LLM (open decision in the planning doc).
