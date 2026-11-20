import type { LlmProvider } from "../../contracts";

/** Placeholder for a model running on the device or a laptop (for example via Ollama). */
export function createLocalLlm(): LlmProvider {
  return {
    id: "local",
    async complete() {
      throw new Error("The local LLM adapter is not implemented yet. Use VITE_LLM=fake.");
    },
  };
}
