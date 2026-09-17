import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function SkillFilter({
  skills,
  selected,
  onToggle,
  onSetAll,
}: {
  skills: string[];
  selected: Set<string>;
  onToggle: (skill: string) => void;
  onSetAll: (select: boolean) => void;
}) {
  // Sort skills from longest to shortest, alphabetical as a tie-break.
  const sortedSkills = [...skills].sort((a, b) => b.length - a.length || a.localeCompare(b));
  const allSelected = sortedSkills.every((s) => selected.has(s));

  return (
    <div className="mb-10 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter by skill">
      <button
        type="button"
        onClick={() => onSetAll(!allSelected)}
        aria-label={allSelected ? "Unselect all skills" : "Select all skills"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
          allSelected
            ? "border-horizon/50 text-horizon hover:text-horizon/70"
            : "border-primary/40 text-primary hover:text-primary/70",
        )}
      >
        {allSelected ? "Unselect all" : "Select all"}
      </button>
      {sortedSkills.map((skill) => {

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
