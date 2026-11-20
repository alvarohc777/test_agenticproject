/**
 * The only way the app talks to a language model.
 * Rules (see AGENTS.md): send summaries, never raw rows or account numbers;
 * numbers come from engines, the model only puts them into words.
 */
export type LlmMessage = { role: "user" | "assistant"; content: string };

export type LlmRequest = {
  system?: string;
  messages: LlmMessage[];
  maxTokens?: number;
};

export type LlmResponse = { text: string };

export interface LlmProvider {
  /** "fake", "claude" or "local". */
  readonly id: string;
  complete(request: LlmRequest): Promise<LlmResponse>;
}
