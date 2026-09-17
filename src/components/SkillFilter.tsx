import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function SkillFilter({
  skills,
  selected,
  onToggle,
}: {
  skills: string[];
  selected: Set<string>;
  onToggle: (skill: string) => void;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter by skill">
      {skills.map((skill) => {
        const active = selected.has(skill);
        return (
          <button
            key={skill}
            type="button"
            onClick={() => onToggle(skill)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
              active
                ? "border-primary/50 bg-primary/20 text-primary"
                : "border-border bg-card/60 text-muted-foreground/60 hover:text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-3.5 w-3.5 items-center justify-center rounded-sm border",
                active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
              )}
            >
              {active && <Check className="h-2.5 w-2.5" strokeWidth={4} aria-hidden="true" />}
            </span>
            {skill}
          </button>
        );
      })}
    </div>
  );
}
