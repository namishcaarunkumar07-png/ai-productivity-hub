import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"] as const;

export function AnswerOptions({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Answer options" className="mt-5 grid gap-3">
      {options.map((option, index) => {
        const isSelected = selected === index;
        return (
          <button
            key={`${index}-${option}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(index)}
            className={cn(
              "focus-visible:ring-ring flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99] sm:text-base",
              isSelected
                ? "border-primary bg-primary/10 text-foreground shadow-sm"
                : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent",
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
              aria-hidden="true"
            >
              {LETTERS[index] ?? index + 1}
            </span>
            <span>{option}</span>
          </button>
        );
      })}
    </div>
  );
}
