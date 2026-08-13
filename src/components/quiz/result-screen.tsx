import { Button } from "@/components/ui/button";
import { QuizCard, QuizTitle } from "@/components/quiz/quiz-card";
import { TOTAL_QUESTIONS } from "@/hooks/use-quiz";

function feedbackFor(score: number) {
  if (score >= 10) return "Outstanding!";
  if (score >= 8) return "Great job!";
  if (score >= 6) return "Good effort!";
  if (score >= 4) return "Keep learning!";
  return "Better luck next time!";
}

export function ResultScreen({
  score,
  country,
  onPlayAgain,
}: {
  score: number;
  country: string | null;
  onPlayAgain: () => void;
}) {
  return (
    <QuizCard className="text-center">
      <QuizTitle as="h2" />
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        QUIZ COMPLETE!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Thank you for completing the quiz!</p>

      <div
        className="animate-in zoom-in-95 mt-6 rounded-2xl bg-gradient-to-r from-primary to-destructive p-6 text-primary-foreground duration-500"
        aria-live="polite"
      >
        <p className="text-sm font-medium opacity-90">Your Score</p>
        <p className="text-4xl font-extrabold sm:text-5xl">
          {score}/{TOTAL_QUESTIONS}
        </p>
        <p className="mt-1 text-base font-semibold">{feedbackFor(score)}</p>
      </div>

      {country ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Quiz topic: <span className="font-medium text-foreground">{country}</span>
        </p>
      ) : null}

      <p className="mt-4 text-sm text-muted-foreground">
        Thank you for taking the time to complete the quiz. We&apos;ll see you next time again!
      </p>

      <Button size="lg" className="mt-6 w-full text-base font-semibold" onClick={onPlayAgain}>
        PLAY AGAIN
      </Button>
    </QuizCard>
  );
}
