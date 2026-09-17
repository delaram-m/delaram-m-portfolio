import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight } from "lucide-react";
import { getCredentialPreview, type CredentialPreview } from "@/lib/credentialPreview.functions";
import awsCredentialPreview from "@/assets/getting_started_with_aws_cloud_essentials_preview.png.asset.json";


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
  link?: string;
  manualPreview?: CredentialPreview;
};

// Add link for a clickable credential and automatic preview. A manually uploaded file can be used instead.
const trainings: Training[] = [
  {
    name: "Getting Started with AWS Cloud Essentials",
    month: "August",
    year: 2026,
    manualPreview: { url: awsCredentialPreview.url, kind: "image" },
  },
  { name: "Certificate or badge name", month: "Month", year: 2026, link: "https://example.com" },
  { name: "Certificate or badge name", month: "Month", year: 2026, link: "https://example.com" },
  { name: "Certificate or badge name", month: "Month", year: 2026, link: "https://example.com" },
];

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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training, i) => (
            <TrainingCard key={i} training={training} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TrainingCard({ training }: { training: Training }) {
  const fetchPreview = useServerFn(getCredentialPreview);
  const { data: linkedPreview, isLoading } = useQuery({
    queryKey: ["credential-preview", training.link],
    queryFn: () => fetchPreview({ data: { link: training.link ?? "" } }),
    enabled: Boolean(training.link) && !training.manualPreview,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
  const preview = training.manualPreview ?? linkedPreview;

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
          <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs text-muted-foreground">
            {isLoading ? "Loading preview…" : "Credential preview"}
          </div>
        )}
      </div>
      <div className="flex min-h-32 items-start gap-3 p-5">
        <div className="min-w-0 flex-1">
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
