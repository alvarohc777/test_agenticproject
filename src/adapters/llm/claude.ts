import type { LlmProvider } from "../../contracts";

/**
 * Claude through our own proxy (proxy/), so the API key never ships in the app.
 * The proxy accepts { system, messages, maxTokens } and returns { text }.
 */
export function createClaudeLlm(proxyUrl: string): LlmProvider {
  return {
    id: "claude",
    async complete(request) {
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!res.ok) throw new Error(`LLM proxy answered ${res.status}`);
      const body = (await res.json()) as { text?: string };
      return { text: body.text ?? "" };
    },
  };
}
