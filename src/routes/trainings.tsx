import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Award } from "lucide-react";
import { getCredentialPreview } from "@/lib/credentialPreview.functions";


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
  month: string;
  year: number;
  skills: string[];
  link?: string;
};

// Add link for a clickable credential; the preview is pulled from that link automatically.
const trainings: Training[] = [
  { name: "Getting Started with AWS Cloud Essentials", month: "August", year: 2026, skills: ["AWS"] },
  {
    name: "Introduction to Data Analytics for Business",
    month: "June",
    year: 2026,
    skills: ["Data Analysis"],
    link: "https://coursera.org/share/79d4bd7456b0ce3fd22e4c4590c8a504",
  },
  {
    name: "Python for Everybody",
    month: "October",
    year: 2021,
    skills: ["Python"],
    link: "https://coursera.org/share/14a0a4242348d12a342cf6d2d533e5e7",
  },
  { name: "Certificate or badge name", month: "Month", year: 2026, skills: ["Skill"], link: "https://example.com" },
  { name: "Certificate or badge name", month: "Month", year: 2026, skills: ["Skill"], link: "https://example.com" },
];

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// Sort by completion date, most recent first. Unknown months sort as January.
function byDateDesc(a: Training, b: Training) {
  const dateValue = (t: Training) => t.year * 100 + (MONTHS.indexOf(t.month.toLowerCase()) + 1 || 1);
  return dateValue(b) - dateValue(a);
}

function TrainingsPage() {
  const sortedTrainings = [...trainings].sort(byDateDesc);
  return (
    <div className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Trainings
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
            Highlight of my certificates and badges
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {sortedTrainings.map((training, i) => (
            <TrainingCard key={i} training={training} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TrainingCard({ training }: { training: Training }) {
  const fetchPreview = useServerFn(getCredentialPreview);
  const { data: preview, isLoading } = useQuery({
    queryKey: ["credential-preview", training.link],
    queryFn: () => fetchPreview({ data: { link: training.link ?? "" } }),
    enabled: Boolean(training.link),
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  const content = (
    <>
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border-b border-border bg-space-elevated/70">
        {preview?.kind === "pdf" ? (
          <iframe
            src={`${preview.url}#view=FitH&toolbar=0`}
            title={`${training.name} preview`}
            className="h-full w-full"
          />
        ) : preview ? (
          <img
            src={preview.url}
            alt={`${training.name} preview`}
            loading="lazy"
            className="h-full w-full object-contain p-4"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-space-elevated to-horizon/15">
            <Award className="h-10 w-10 text-muted-foreground/60" aria-hidden="true" />
            {isLoading && (
              <span className="absolute bottom-2 text-[10px] text-muted-foreground/60">
                Loading preview…
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex min-h-32 items-start gap-3 p-5">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {training.skills.map((skill) => (
              <p
                key={skill}
                className="w-fit rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary"
              >
                {skill}
              </p>
            ))}
          </div>
          <h2 className="text-base font-semibold leading-snug text-foreground">{training.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {training.month} {training.year}
          </p>
          {training.link && (
            <a
              href={training.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-horizon transition-colors hover:text-horizon/70"
            >
              View credential
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </>
  );

  const className =
    "group block overflow-hidden rounded-xl border border-border bg-card/90 transition-all hover:border-horizon/60 hover:shadow-lg hover:shadow-horizon/10";

  return <article className={className}>{content}</article>;
}
