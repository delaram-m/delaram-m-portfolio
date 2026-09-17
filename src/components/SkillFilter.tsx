import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  // When the skill pills wrap to more than one line, give the select/unselect
  // button its own visually separated column so it stands apart.
  const listRef = useRef<HTMLDivElement>(null);
  const [multiLine, setMultiLine] = useState(false);
  const skillKey = sortedSkills.join("|");

  useEffect(() => {
    const el = listRef.current;
    if (!el || !el.firstElementChild) return;
    const measure = () => {
      const lineHeight = el.firstElementChild!.clientHeight;
      setMultiLine(el.clientHeight > lineHeight + 4);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [skillKey]);

  const selectAllButton = (
    <button
      type="button"
      onClick={() => onSetAll(!allSelected)}
      aria-label={allSelected ? "Unselect all skills" : "Select all skills"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-horizon transition-colors hover:text-horizon/70",
        allSelected
          ? "border border-solid border-horizon/50 bg-horizon/15"
          : "border border-dashed border-horizon/50",
      )}
    >
      {allSelected ? "Unselect all" : "Select all"}
    </button>
  );

  return (
    <div
      className={cn(
        "mb-10 flex items-center gap-2",
        multiLine ? "justify-start gap-4" : "justify-center",
      )}
      role="group"
      aria-label="Filter by skill"
    >
      <div className="flex shrink-0 items-center">{selectAllButton}</div>
      <div
        ref={listRef}
        className={cn(
          "flex flex-wrap items-center gap-2",
          multiLine ? "flex-1 justify-start" : "justify-center",
        )}
      >
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
    </div>
  );
}
