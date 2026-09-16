import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/trainings")({
  head: () => ({
    meta: [
      { title: "Trainings — Delaram Moradi" },
      { name: "description", content: "Badges, MOOCs, and certificates completed by Delaram Moradi." },
      { property: "og:title", content: "Trainings — Delaram Moradi" },
      { property: "og:description", content: "Badges, MOOCs, and certificates completed by Delaram Moradi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrainingsPage,
});

type Training = {
  name: string;
  link?: string;
};

// Add your badges, MOOCs, and certificates here.
const trainings: Training[] = [
  { name: "Certificate name" },
  { name: "Certificate name" },
  { name: "Certificate name" },
  { name: "Certificate name" },
];

function faviconFor(link?: string) {
  if (!link) return null;
  try {
    const { hostname } = new URL(link);
    return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
  } catch {
    return null;
  }
}

function TrainingsPage() {
  return (
    <div className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Trainings
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
            Highlight of my certificates and badges
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training, i) => (
            <TrainingCard key={i} training={training} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TrainingCard({ training }: { training: Training }) {
  const icon = faviconFor(training.link);

  const content = (
    <>
      {icon && (
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-8 w-8 shrink-0 rounded-md bg-muted/40 object-contain p-1"
        />
      )}
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold leading-snug text-foreground">{training.name}</h2>
      </div>
      {training.link && (
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-horizon transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </>
  );

  const className =
    "group flex items-center gap-3 rounded-xl border border-border bg-card/90 p-4 transition-all hover:border-horizon/60 hover:shadow-lg hover:shadow-horizon/10";

  return training.link ? (
    <a href={training.link} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <article className={className}>{content}</article>
  );
}
