import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, GraduationCap, FlaskConical, FileText } from "lucide-react";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Delaram Moradi" },
      { name: "description", content: "Experience, research, publications, and teaching work by Delaram Moradi." },
      { property: "og:title", content: "Experience — Delaram Moradi" },
      { property: "og:description", content: "Experience, research, publications, and teaching work by Delaram Moradi." },
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
            Academic interests, scholarly work, and teaching experience — ready to be filled in.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <SectionCard
            icon={<FlaskConical className="h-5 w-5" />}
            title="Research Interests"
            description="A place to outline current research areas, questions, and methodological focus."
          />
          <SectionCard
            icon={<FileText className="h-5 w-5" />}
            title="Publications"
            description="Papers, preprints, and other scholarly outputs will be listed here with links."
          />
          <SectionCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Courses"
            description="Courses taught, syllabi, and teaching philosophy will appear in this section."
          />
          <SectionCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Talks & Workshops"
            description="Invited talks, conference presentations, and workshop materials will be added here."
          />
        </div>

        <div className="mt-16 rounded-2xl border border-border/60 bg-card/50 p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-foreground">Curriculum Vitae</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A downloadable CV or résumé can be linked here once it is ready.
          </p>
          <button
            type="button"
            disabled
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-5 py-2.5 text-sm font-medium text-muted-foreground"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            CV coming soon
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/70">
      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
