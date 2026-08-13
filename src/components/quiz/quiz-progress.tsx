export function QuizProgress({ progress }: { progress: number }) {
  return (
    <div className="mt-6">
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-destructive transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
        {progress}% completed
      </p>
    </div>
  );
}
