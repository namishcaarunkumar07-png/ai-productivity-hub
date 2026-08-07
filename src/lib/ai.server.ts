import { streamText } from "ai";
import { AI_MODEL, createLovableAiGatewayProvider } from "./ai-gateway.server";

export async function runPrompt(system: string, prompt: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this app.");

  const gateway = createLovableAiGatewayProvider(key);

  try {
    const result = streamText({
      model: gateway(AI_MODEL),
      system,
      prompt,
    });
    return (await result.text).trim();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("429")) {
      throw new Error("Too many requests right now — please wait a moment and try again.");
    }
    if (message.includes("402")) {
      throw new Error("AI usage limit reached for this workspace.");
    }
    throw new Error("The AI request failed. Please try again.");
  }
}

export function parseJson<T>(text: string): T | null {
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
