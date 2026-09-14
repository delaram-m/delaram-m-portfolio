import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Code2, BookOpen, Mail } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Delaram Moradi — Creative Portfolio" },
      { name: "description", content: "Personal portfolio of Delaram Moradi: projects, research, teaching, and creative work." },
      { property: "og:title", content: "Delaram Moradi — Creative Portfolio" },
      { property: "og:description", content: "Personal portfolio of Delaram Moradi: projects, research, teaching, and creative work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative flex min-h-[calc(100vh-7rem)] flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Creative Portfolio</span>
            </div>

            <h1 className="text-balance text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Delaram <span className="text-primary">Moradi</span>
            </h1>

            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
              A personal space for projects, research, teaching, and creative exploration.
              Built to feel like a quiet corner of the galaxy.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
              >
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative h-72 w-72 rounded-full bg-gradient-to-br from-primary/20 via-nebula/30 to-horizon/20 p-1 shadow-2xl shadow-primary/10">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-space/80 text-6xl font-light text-stardust">
                DM
              </div>
              <div className="absolute -right-2 top-8 h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_rgba(167,139,250,0.8)]" />
              <div className="absolute bottom-10 -left-2 h-2 w-2 rounded-full bg-horizon shadow-[0_0_16px_rgba(96,165,250,0.7)]" />
            </div>
          </div>
        </div>

        <nav aria-label="Featured sections" className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            to="/projects"
            icon={<Code2 className="h-5 w-5" />}
            title="Projects"
            description="Selected work and creative experiments."
          />
          <FeatureCard
            to="/research-teaching"
            icon={<BookOpen className="h-5 w-5" />}
            title="Research & Teaching"
            description="Academic interests, publications, and courses."
          />
          <FeatureCard
            to="/contact"
            icon={<Mail className="h-5 w-5" />}
            title="Contact"
            description="Social links and ways to connect."
          />
        </nav>
      </div>
    </div>
  );
}

function FeatureCard({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-horizon transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
