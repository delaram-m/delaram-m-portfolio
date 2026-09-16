import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Route as RouteIcon, Mail, Award } from "lucide-react";


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
    <div className="relative flex min-h-[calc(100vh-7rem)] flex-col justify-center px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl shrink-0">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="w-fit bg-gradient-to-r from-primary via-nebula via-46% to-horizon to-80% bg-clip-text text-balance text-5xl font-black leading-[1.1] tracking-tight text-transparent drop-shadow-[0_0_20px_rgba(160,185,255,0.35)] sm:text-6xl lg:text-7xl">
              Delaram Moradi
            </h1>

            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
              A computer science master's alumna from the University of Waterloo and a computer
              science bachelor's alumna from Tehran Polytechnic with a diverse portfolio of
              technical projects and 3 co-authored conference papers published in Springer
              Nature's Lecture Notes in Computer Science
            </p>
          </div>

          <div className="self-center lg:block">
            <div className="profile-ring relative h-44 w-44 rounded-full p-1 shadow-2xl shadow-horizon/20 sm:h-52 sm:w-52 lg:h-72 lg:w-72">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-space-elevated/60">
                <span className="bg-gradient-to-r from-primary via-nebula to-horizon bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl lg:text-7xl">
                  DM
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="Featured sections" className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            to="/projects"
            icon={<Code2 className="h-5 w-5" />}
            title="Projects"
          />
          <FeatureCard
            to="/experience"
            icon={<RouteIcon className="h-5 w-5" />}
            title="Experience"
          />
          <FeatureCard
            to="/trainings"
            icon={<Award className="h-5 w-5" />}
            title="Trainings"
          />
          <FeatureCard
            to="/contact"
            icon={<Mail className="h-5 w-5" />}
            title="Contact"
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
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/90 p-6 transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/15"
    >
      <div className="mb-4 inline-flex rounded-xl bg-primary/15 p-3 text-primary transition-colors group-hover:bg-primary/25">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary via-nebula to-horizon transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
