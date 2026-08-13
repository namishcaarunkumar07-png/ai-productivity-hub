import { Button } from "@/components/ui/button";
import { QuizCard, QuizTitle } from "@/components/quiz/quiz-card";

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <QuizCard className="text-center">
      <QuizTitle />
      <p className="mt-3 text-base text-muted-foreground">
        Test your knowledge and see how much you know about your country!
      </p>
      <p className="mt-8 text-lg font-semibold text-foreground">Are you ready for this quiz?</p>
      <Button size="lg" className="mt-6 w-full text-base font-semibold" onClick={onStart}>
        START QUIZ
      </Button>
      <p className="mt-4 text-xs text-muted-foreground">
        10 questions · no account needed · questions are AI-generated, so double-check the fun facts.
      </p>
    </QuizCard>
  );
}
