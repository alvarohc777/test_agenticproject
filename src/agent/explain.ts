import type { LlmProvider } from "../contracts";
import type { ReportFacts } from "../engines/report";
import { SYSTEM_PROMPT } from "./prompts";

/**
 * Turns engine facts into a short text. Takes ReportFacts, never transactions,
 * so raw rows cannot reach the model by accident.
 */
export async function explainMonth(llm: LlmProvider, facts: ReportFacts, language: string): Promise<string> {
  const { text } = await llm.complete({
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Language: ${language}. Write three sentences about this month. Facts (amounts in Rappen): ${JSON.stringify(facts)}`,
      },
    ],
    maxTokens: 300,
  });
  return text;
}
