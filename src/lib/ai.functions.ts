import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  recipient: z.string(),
  purpose: z.string(),
  keyPoints: z.string(),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

const PlannerInput = z.object({
  tasks: z.array(
    z.object({ title: z.string(), deadline: z.string(), duration: z.string() }),
  ),
  range: z.enum(["Daily", "Weekly"]),
});

const ResearchInput = z.object({ topic: z.string() });

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai.server");
    const text = await runPrompt(
      `You are an expert business writer. Write a single professional email. Return only the email text: an optional "Subject:" line, then the body with a greeting and sign-off. No commentary, no markdown fences.`,
      `Recipient: ${data.recipient}
Purpose / subject: ${data.purpose}
Key information to include:
${data.keyPoints}
Tone: ${data.tone}`,
    );
    return { text };
  });

export const generateSchedule = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const { runPrompt, parseJson } = await import("./ai.server");
    const text = await runPrompt(
      `You are a productivity planner. Prioritise the user's tasks by urgency and importance for the requested schedule range.
Respond with ONLY a JSON object of this shape, no markdown fences:
{"items":[{"title":"...","slot":"e.g. Mon 09:00-10:30 or 09:00-10:30","priority":"High|Medium|Low","note":"one short reason"}]}
Order items in the sequence they should be worked on.`,
      `Range: ${data.range}
Tasks:
${data.tasks
  .map(
    (t, i) =>
      `${i + 1}. ${t.title} | deadline: ${t.deadline || "none"} | estimated duration: ${t.duration || "unknown"}`,
  )
  .join("\n")}`,
    );

    const parsed = parseJson<{
      items?: { title?: string; slot?: string; priority?: string; note?: string }[];
    }>(text);

    const items = (parsed?.items ?? []).map((item) => ({
      title: String(item.title ?? "Untitled task"),
      slot: String(item.slot ?? ""),
      priority: (["High", "Medium", "Low"] as const).includes(
        item.priority as "High" | "Medium" | "Low",
      )
        ? (item.priority as "High" | "Medium" | "Low")
        : ("Medium" as const),
      note: String(item.note ?? ""),
    }));

    if (items.length === 0) {
      throw new Error("The planner could not build a schedule. Please try again.");
    }

    return { items };
  });

export const generateResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const { runPrompt, parseJson } = await import("./ai.server");
    const text = await runPrompt(
      `You are a research assistant. Analyse the user's topic or pasted article.
Respond with ONLY a JSON object, no markdown fences:
{"summary":"3-5 sentence plain-language summary","insights":["..."],"recommendations":["..."]}
Give 3-5 insights and 3-5 recommendations, each one sentence.`,
      data.topic,
    );

    const parsed = parseJson<{
      summary?: string;
      insights?: string[];
      recommendations?: string[];
    }>(text);

    if (!parsed?.summary) {
      throw new Error("The assistant could not produce a summary. Please try again.");
    }

    return {
      summary: String(parsed.summary),
      insights: (parsed.insights ?? []).map(String).slice(0, 6),
      recommendations: (parsed.recommendations ?? []).map(String).slice(0, 6),
    };
  });
