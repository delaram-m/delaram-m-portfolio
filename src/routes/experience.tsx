import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Delaram Moradi" },
      { name: "description", content: "Professional experience and volunteering by Delaram Moradi." },
      { property: "og:title", content: "Experience — Delaram Moradi" },
      { property: "og:description", content: "Professional experience and volunteering by Delaram Moradi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  return (
    <div className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Experience
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
            Highlight of my experience and volunteering
          </p>
        </header>

        <div className="relative">
          <div
            aria-hidden
            className="absolute left-[9px] top-4 bottom-4 w-0.5 rounded-full bg-gradient-to-b from-primary/70 via-horizon/60 to-primary/10"
          />
          <ol className="space-y-6">
            <ExperienceEntry
              title="Graduate Research Student"
              org="University of Waterloo"
              dates="September 2024 - April 2026"
              bullets={[
                "Provided progress reports and independently defined and planned tasks on a weekly basis",
                "Wrote Python code that generates CSV or TXT data to explore patterns and bounds",
                "Collaborated with other researchers, including professors and postdocs, to solve problems",
                "Co-authored 3 conference papers published in Springer Nature's Lecture Notes in Computer Science",
                "Created a master's thesis and successfully presented it to the committee members",
              ]}
            />
            <ExperienceEntry
              title="Teaching Assistant"
              org="University of Waterloo"
              dates="September 2024 - April 2026"
              bullets={[
                "Held office hours to respond to student questions and guide them in problem-solving",
                "Developed marking schemes collaboratively to ensure grading consistency",
                "Provided constructive feedback on essays to help students improve their writing and critical thinking",
                "Provided feedback to an instructor on role-playing exercise descriptions",
                "Marked assignments and exams, and provided constructive feedback to students",
              ]}
            />
            <ExperienceEntry
              title="Teaching Assistant (volunteer)"
              org={"Amirkabir University of Technology (Tehran Polytechnic) "}
              dates={`
`}
              bullets={[
                "Planned and led online TA sessions including solving exercises with students to improve student learning",
                "Responded to students online between TA sessions to address their questions and concerns",
                "Facilitated communication between students and the instructor",
                "Created and published assignments on a learning management system (LMS)",
                "Marked assignments and provided constructive feedback to students",
              ]}
            />
            <ExperienceEntry
              title="Tech Support (volunteer)"
              org="University of Waterloo Teaching and Learning Conference"
              bullets={[
                "Hosted a Zoom meeting for an online session, including management of co-host privileges and live captioning",
                "Communicated necessary messages and assisted presenters with time management",
              ]}
            />
            <ExperienceEntry
              title="Science Writer (volunteer)"
              org="Halgheh Student Science Magazine"
              bullets={[
                "Independently learned the basic concepts of a field through online sources",
                "Composed an article and incorporated editorial feedback to improve the article",
              ]}
            />
          </ol>
        </div>
      </div>
    </div>
  );
}

function ExperienceEntry({
  title,
  org,
  dates,
  bullets,
}: {
  title: string;
  org: string;
  dates?: string;
  bullets: string[];
}) {
  const showDates = Boolean(dates?.trim());
  return (
    <li className="relative pl-10 sm:pl-14">
      <span
        aria-hidden
        className="absolute left-0 top-7 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-primary/60 bg-background ring-4 ring-primary/15 sm:top-9"
      >
        <span className="h-2 w-2 rounded-full bg-primary shadow-md shadow-primary/70" />
      </span>
      <article className="rounded-2xl border border-border bg-card/90 p-6 transition-all hover:border-horizon/60 hover:shadow-lg hover:shadow-horizon/10 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {showDates ? <p className="text-sm font-medium text-horizon">{dates}</p> : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{org}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </article>
    </li>
  );
}
