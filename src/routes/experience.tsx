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
      <div className="mx-auto max-w-4xl">
        <header className="mb-14 text-center">
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
            className="absolute left-[125px] top-3 bottom-3 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/70 via-horizon/60 to-primary/10 sm:left-[157px]"
          />
          <ol className="space-y-12">
            <ExperienceEntry
              title="Graduate Research Student"
              org="University of Waterloo"
              dates="September 2024 - April 2026"
            />
            <ExperienceEntry
              title="Teaching Assistant"
              org="University of Waterloo"
              dates="September 2024 - April 2026"
            />
            <ExperienceEntry
              title="Teaching Assistant (volunteer)"
              org="Amirkabir University of Technology (Tehran Polytechnic)"
            />
            <ExperienceEntry
              title="Tech Support (volunteer)"
              org="University of Waterloo Teaching and Learning Conference"
            />
            <ExperienceEntry
              title="Science Writer (volunteer)"
              org="Halgheh Student Science Magazine"
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
}: {
  title: string;
  org: string;
  dates?: string;
}) {
  const showDates = Boolean(dates?.trim());
  return (
    <li className="relative grid grid-cols-[112px_1fr] gap-x-8 sm:grid-cols-[144px_1fr]">
      <p className="pt-0.5 text-right text-sm font-medium leading-5 text-horizon">
        {showDates ? dates : ""}
      </p>
      <span
        aria-hidden
        className="absolute left-[125px] top-[6px] z-10 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border border-primary/60 bg-background ring-4 ring-primary/15 sm:left-[157px]"
      >
        <span className="h-1 w-1 rounded-full bg-primary shadow-md shadow-primary/70" />
      </span>
      <div>
        <h2 className="text-lg font-semibold leading-6 text-foreground">{title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{org}</p>
      </div>
    </li>
  );
}
