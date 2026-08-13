import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function QuizCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "animate-in fade-in zoom-in-95 w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-xl duration-300 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function QuizTitle({ as: As = "h1" }: { as?: "h1" | "h2" }) {
  return (
    <As className="text-center text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
      QUIZ GAME
    </As>
  );
}
