/**
 * LLM proxy as a Cloudflare Worker (any serverless host works the same way).
 * Holds the API key so it never ships in the app. Accepts { system, messages, maxTokens }
 * from src/adapters/llm/claude.ts and returns { text }.
 *
 * Environment (set in the host's dashboard, never in the repo):
 *   ANTHROPIC_API_KEY  the key
 *   ALLOWED_ORIGIN     e.g. https://<user>.github.io
 *   MODEL              optional, defaults below
 */
type Env = { ANTHROPIC_API_KEY: string; ALLOWED_ORIGIN: string; MODEL?: string };
type Body = { system?: string; messages: { role: "user" | "assistant"; content: string }[]; maxTokens?: number };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = {
      "access-control-allow-origin": env.ALLOWED_ORIGIN,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

    const body = (await request.json()) as Body;
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: env.MODEL ?? "claude-sonnet-5-5",
        max_tokens: Math.min(body.maxTokens ?? 500, 1000),
        system: body.system,
        messages: body.messages,
      }),
    });
    if (!upstream.ok) return new Response("Upstream error", { status: 502, headers: cors });

    const data = (await upstream.json()) as { content?: { type: string; text?: string }[] };
    const text = (data.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join("");
    return new Response(JSON.stringify({ text }), { headers: { ...cors, "content-type": "application/json" } });
  },
};
