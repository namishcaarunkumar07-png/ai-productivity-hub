import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const QuizInput = z.object({ country: z.string().min(2).max(80) });

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export const generateCountryQuiz = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => QuizInput.parse(input))
  .handler(async ({ data }): Promise<{ questions: QuizQuestion[] }> => {
    const { runPrompt, parseJson } = await import("./ai.server");

    const text = await runPrompt(
      `You are a quiz writer creating a fun general-knowledge quiz about a single country.
Write exactly 9 multiple-choice questions about the given country, each from a DIFFERENT category:
capital city, currency, flag, geography, famous landmark, national symbol, history, language, culture or an interesting fact.
Rules:
- Every question has exactly 4 plausible options, exactly one of which is correct.
- Facts must be accurate and suitable for a general audience.
- Vary the position of the correct answer.
- Keep questions and options short (options under 40 characters where possible).
Respond with ONLY this JSON object, no markdown fences:
{"questions":[{"question":"...","options":["A","B","C","D"],"correctIndex":0}]}`,
      `Country: ${data.country}
Pick a fresh, varied set of questions (random seed ${Math.random().toString(36).slice(2)}).`,
    );

    const parsed = parseJson<{
      questions?: { question?: string; options?: unknown; correctIndex?: unknown }[];
    }>(text);

    const questions: QuizQuestion[] = (parsed?.questions ?? [])
      .map((q) => {
        const options = Array.isArray(q.options) ? q.options.map((o) => String(o)) : [];
        const correctIndex = Number(q.correctIndex);
        return {
          question: String(q.question ?? "").trim(),
          options,
          correctIndex,
        };
      })
      .filter(
        (q) =>
          q.question.length > 0 &&
          q.options.length === 4 &&
          q.options.every((o) => o.trim().length > 0) &&
          Number.isInteger(q.correctIndex) &&
          q.correctIndex >= 0 &&
          q.correctIndex <= 3,
      )
      .slice(0, 9);

    if (questions.length < 9) {
      throw new Error("Could not build the quiz for that country. Please try again.");
    }

    return { questions };
  });
