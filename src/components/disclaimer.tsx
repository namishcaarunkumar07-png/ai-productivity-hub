import { ShieldAlert } from "lucide-react";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        AI-generated content may contain inaccurate or incomplete information. Always review and
        verify AI outputs before using them professionally. Do not enter confidential or sensitive
        information.
      </p>
    );
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
      <p className="text-sm leading-relaxed text-foreground/80">
        AI-generated content may contain inaccurate or incomplete information. Always review and
        verify AI outputs before using them professionally. Do not enter confidential or sensitive
        information.
      </p>
    </div>
  );
}
