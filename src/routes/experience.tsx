import { createFileRoute } from "@tanstack/react-router";
import { Route as RouteIcon } from "lucide-react";

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

        <div className="space-y-6">
          <ExperiencePlaceholder index={1} />
          <ExperiencePlaceholder index={2} />
          <ExperiencePlaceholder index={3} />
        </div>
      </div>
    </div>
  );
}

function ExperiencePlaceholder({ index }: { index: number }) {
  return (
    <article className="rounded-2xl border border-border bg-card/90 p-6 transition-all hover:border-horizon/60 hover:shadow-lg hover:shadow-horizon/10 sm:p-8">
      <div className="flex items-start gap-4">
          <div className="mt-1 inline-flex rounded-xl bg-horizon/15 p-3 text-horizon">
          <RouteIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Experience {index}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>A key responsibility, achievement, or contribution will appear here.</li>
            <li>Another detail about this experience or volunteer role will appear here.</li>
          </ul>
        </div>
      </div>
    </article>
  );
}
