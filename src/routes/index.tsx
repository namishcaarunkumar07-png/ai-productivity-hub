import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnswerOptions } from "@/components/quiz/answer-options";
import { CountryQuestion } from "@/components/quiz/country-question";
import { QuizCard, QuizTitle } from "@/components/quiz/quiz-card";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import { ResultScreen } from "@/components/quiz/result-screen";
import { WelcomeScreen } from "@/components/quiz/welcome-screen";
import { TOTAL_QUESTIONS, useQuiz } from "@/hooks/use-quiz";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quiz Game — How well do you know your country?" },
      {
        name: "description",
        content:
          "Play a fun 10-question quiz about your own country. Pick your country and test your knowledge of its capital, currency, landmarks and culture.",
      },
      { property: "og:title", content: "Quiz Game — How well do you know your country?" },
      {
        property: "og:description",
        content:
          "A fun 10-question quiz about your country: capital, currency, landmarks, culture and more.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const quiz = useQuiz();

  if (quiz.status === "welcome") {
    return <WelcomeScreen onStart={quiz.start} />;
  }

  if (quiz.status === "complete") {
    return (
      <ResultScreen score={quiz.score} country={quiz.country} onPlayAgain={quiz.reset} />
    );
  }

  if (quiz.status === "error") {
    return (
      <QuizCard className="text-center">
        <QuizTitle />
        <p className="mt-6 text-base font-semibold text-foreground">We couldn&apos;t build your quiz</p>
        <p className="mt-2 text-sm text-muted-foreground">{quiz.error}</p>
        <div className="mt-6 grid gap-3">
          <Button size="lg" className="text-base font-semibold" onClick={quiz.retry}>
            TRY AGAIN
          </Button>
          <Button variant="outline" size="lg" onClick={quiz.reset}>
            Start over
          </Button>
        </div>
      </QuizCard>
    );
  }

  const isCountryStep = quiz.status === "country" || quiz.status === "loading";
  const isLoading = quiz.status === "loading";

  return (
    <QuizCard>
      <QuizTitle />

      <p className="mt-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Question {quiz.questionNumber} of {TOTAL_QUESTIONS}
      </p>

      <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl" aria-live="polite">
        {isCountryStep ? "Which country are you from?" : quiz.question?.question}
      </h2>

      {isCountryStep ? (
        isLoading ? (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-muted/60 py-10 text-sm font-medium text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Building your questions about {quiz.country}…
          </div>
        ) : (
          <CountryQuestion country={quiz.country} onSelect={quiz.selectCountry} />
        )
      ) : (
        <AnswerOptions
          options={quiz.question?.options ?? []}
          selected={quiz.selected}
          onSelect={quiz.selectAnswer}
        />
      )}

      {quiz.hint ? (
        <p className="mt-4 text-center text-sm font-medium text-destructive" role="alert">
          {quiz.hint}
        </p>
      ) : null}

      <Button
        size="lg"
        className="mt-6 w-full text-base font-semibold"
        onClick={isCountryStep ? quiz.confirmCountry : quiz.next}
        disabled={isLoading}
      >
        {isCountryStep
          ? "NEXT QUESTION"
          : quiz.isLastQuestion
            ? "FINISH QUIZ"
            : "NEXT QUESTION"}
      </Button>

      <QuizProgress progress={quiz.progress} />
    </QuizCard>
  );
}
