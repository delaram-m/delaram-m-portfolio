import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen, Plus } from "lucide-react";

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
            A curated space for future case studies, creative experiments, and portfolio pieces.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectPlaceholder />
          <ProjectPlaceholder />
          <ProjectPlaceholder />
        </div>

        <div className="mt-16 rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
            <Plus className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">More projects coming soon</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            This portfolio is intentionally starting empty. Each project will be added with its own story, visuals, and details.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProjectPlaceholder() {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/70">
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary/5 via-nebula/10 to-horizon/5">
        <FolderOpen className="h-10 w-10 text-muted-foreground/40 transition-colors group-hover:text-primary/60" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-lg font-semibold text-foreground">Project Title</h2>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          A brief description of the project will appear here, alongside its role, tools, and outcome.
        </p>
        <span className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-60 transition-opacity group-hover:opacity-100">
          View case study
        </span>
      </div>
    </article>
  );
}
