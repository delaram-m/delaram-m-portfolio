import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, FolderOpen } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Delaram Moradi" },
      { name: "description", content: "Portfolio of projects and creative work by Delaram Moradi." },
      { property: "og:title", content: "Projects — Delaram Moradi" },
      { property: "og:description", content: "Portfolio of projects and creative work by Delaram Moradi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <div className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Projects
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
            A highlight of some projects.
          </p>
        </header>

        <div className="space-y-10">
          <ProjectPlaceholder index={1} />
          <ProjectPlaceholder index={2} reverse />
          <ProjectPlaceholder index={3} />
        </div>
      </div>
    </div>
  );
}

function ProjectPlaceholder({ index, reverse = false }: { index: number; reverse?: boolean }) {
  return (
    <article className={`group grid overflow-hidden rounded-2xl border border-border bg-card/90 transition-all hover:border-horizon/60 hover:shadow-lg hover:shadow-horizon/10 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
      <div className="flex min-h-60 items-center justify-center bg-gradient-to-br from-horizon/25 via-primary/15 to-nebula/20 md:min-h-72">
        <FolderOpen className="h-10 w-10 text-muted-foreground/50 transition-colors group-hover:text-primary/70" aria-hidden="true" />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-9">
        <span className="text-xs font-semibold uppercase text-horizon">Project {index}</span>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">Project Title</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          A short project description will appear here, giving an overview of the work and its outcome.
        </p>
        <a href="#" className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-horizon transition-colors hover:text-primary">
          View
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
