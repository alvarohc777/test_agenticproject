import type { LlmProvider } from "../../contracts";

/**
 * Canned answers for tests and offline demos, so screens can be built before any
 * model is wired. Never calls the network.
 */
export function createFakeLlm(): LlmProvider {
  return {
    id: "fake",
    async complete({ messages }) {
      const sent = messages.filter((m) => m.role === "user").at(-1)?.content.length ?? 0;
      return {
        text: `(Fake model) This is where the written summary will appear. It received ${sent} characters of facts. Set VITE_LLM=claude and VITE_PROXY_URL for real text.`,
      };
    },
  };
}
