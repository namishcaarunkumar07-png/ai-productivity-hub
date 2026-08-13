import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { generateCountryQuiz, type QuizQuestion } from "@/lib/quiz.functions";

export const TOTAL_QUESTIONS = 10;

export type QuizStatus = "welcome" | "country" | "loading" | "error" | "playing" | "complete";

export function useQuiz() {
  const generate = useServerFn(generateCountryQuiz);

  const [status, setStatus] = useState<QuizStatus>("welcome");
  const [country, setCountry] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0); // 0-based within questions
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const loadQuestions = useCallback(
    async (selectedCountry: string) => {
      setStatus("loading");
      setError(null);
      try {
        const result = await generate({ data: { country: selectedCountry } });
        setQuestions(result.questions);
        setQuestionIndex(0);
        setSelected(null);
        setStatus("playing");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setStatus("error");
      }
    },
    [generate],
  );

  const start = useCallback(() => {
    setStatus("country");
    setHint(null);
  }, []);

  const selectCountry = useCallback((value: string) => {
    setCountry(value);
    setHint(null);
  }, []);

  const confirmCountry = useCallback(() => {
    if (!country) {
      setHint("Please select your country to continue.");
      return;
    }
    // Question 1 identifies the country and always counts as answered correctly.
    setScore(1);
    void loadQuestions(country);
  }, [country, loadQuestions]);

  const selectAnswer = useCallback((index: number) => {
    setSelected(index);
    setHint(null);
  }, []);

  const next = useCallback(() => {
    if (selected === null) {
      setHint("Please select an answer to continue.");
      return;
    }
    const current = questions[questionIndex];
    if (current && selected === current.correctIndex) {
      setScore((s) => s + 1);
    }
    if (questionIndex + 1 >= questions.length) {
      setStatus("complete");
      return;
    }
    setQuestionIndex((i) => i + 1);
    setSelected(null);
  }, [selected, questions, questionIndex]);

  const reset = useCallback(() => {
    setStatus("welcome");
    setCountry(null);
    setQuestions([]);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setError(null);
    setHint(null);
  }, []);

  const retry = useCallback(() => {
    if (country) void loadQuestions(country);
    else setStatus("country");
  }, [country, loadQuestions]);

  // Display number: 1 for the country question, 2..10 for generated questions.
  const questionNumber = status === "country" || status === "loading" ? 1 : questionIndex + 2;
  const progress = Math.round((questionNumber / TOTAL_QUESTIONS) * 100);
  const isLastQuestion = questions.length > 0 && questionIndex === questions.length - 1;

  return {
    status,
    country,
    questions,
    question: questions[questionIndex],
    questionIndex,
    questionNumber,
    progress,
    isLastQuestion,
    selected,
    score,
    error,
    hint,
    start,
    selectCountry,
    confirmCountry,
    selectAnswer,
    next,
    reset,
    retry,
  };
}
