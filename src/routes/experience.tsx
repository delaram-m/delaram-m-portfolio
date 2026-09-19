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

const MONTH_PX = 30;
const TRACK_GAP = 26;
const BAR_WIDTH = 10;

/** year * 12 + (month - 1) */
function monthIndex(year: number, month: number) {
  return year * 12 + (month - 1);
}

type DatedExperience = {
  title: string;
  org: string;
  datesDisplay: string;
  start: number;
  end: number;
  track: number;
  /** where along the bar the label sits, 0 = top, 1 = bottom */
  labelAt: number;
  barClass: string;
};

type UndatedExperience = {
  title: string;
  org: string;
};

const datedExperiences: DatedExperience[] = [
  {
    title: "Graduate Research Student",
    org: "University of Waterloo",
    datesDisplay: "Sep 2024 - Apr 2026",
    start: monthIndex(2024, 9),
    end: monthIndex(2026, 4),
    track: 0,
    labelAt: 0.15,
    barClass: "bg-primary/80 shadow-[0_0_14px_2px] shadow-primary/40",
  },
  {
    title: "Teaching Assistant",
    org: "University of Waterloo",
    datesDisplay: "Sep 2024 - Apr 2026",
    start: monthIndex(2024, 9),
    end: monthIndex(2026, 4),
    track: 1,
    labelAt: 0.85,
    barClass: "bg-horizon/80 shadow-[0_0_14px_2px] shadow-horizon/40",
  },
  {
    title: "Tech Support (volunteer)",
    org: "University of Waterloo Teaching and Learning Conference",
    datesDisplay: "Apr 2025",
    start: monthIndex(2025, 4),
    end: monthIndex(2025, 4),
    track: 2,
    labelAt: 0.5,
    barClass: "bg-nebula/80 shadow-[0_0_14px_2px] shadow-nebula/40",
  },
];

const undatedExperiences: UndatedExperience[] = [
  {
    title: "Teaching Assistant (volunteer)",
    org: "Amirkabir University of Technology (Tehran Polytechnic)",
  },
  {
    title: "Science Writer (volunteer)",
    org: "Halgheh Student Science Magazine",
  },
];

function ExperiencePage() {
  const min = Math.min(...datedExperiences.map((e) => e.start));
  const max = Math.max(...datedExperiences.map((e) => e.end));
  const axisHeight = (max - min + 1) * MONTH_PX;

  const topPx = (month: number) => (max - month) * MONTH_PX;

  const trackCount = Math.max(...datedExperiences.map((e) => e.track)) + 1;
  const railWidth = (trackCount - 1) * TRACK_GAP + BAR_WIDTH + 8;

  const startYear = Math.floor(min / 12);
  const endYear = Math.floor(max / 12);
  const years: { year: number; top: number }[] = [];
  for (let y = startYear; y <= endYear; y++) {
    const jan = Math.min(Math.max(monthIndex(y, 1), min), max);
    years.push({ year: y, top: topPx(jan) });
  }

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

        <div className="flex">
          {/* Year markers */}
          <div className="relative w-10 shrink-0" style={{ height: axisHeight }}>
            {years.map(({ year, top }) => (
              <span
                key={year}
                className="absolute right-2 -translate-y-1/2 text-xs font-medium text-muted-foreground"
                style={{ top }}
              >
                {year}
              </span>
            ))}
          </div>

          {/* Rail with span bars */}
          <div
            className="relative shrink-0"
            style={{ width: railWidth, height: axisHeight }}
          >
            <div
              aria-hidden
              className="absolute bottom-0 top-0 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/40 via-horizon/30 to-primary/10"
              style={{ left: railWidth / 2 }}
            />
            {years.map(({ year, top }) => (
              <div
                key={year}
                aria-hidden
                className="absolute left-0 right-0 border-t border-border/40"
                style={{ top }}
              />
            ))}
            {datedExperiences.map((e) => {
              const top = topPx(e.end);
              const height = (e.end - e.start + 1) * MONTH_PX;
              return (
                <div
                  key={e.title}
                  aria-hidden
                  className={`absolute rounded-full ${e.barClass}`}
                  style={{
                    top,
                    height,
                    left: 4 + e.track * TRACK_GAP,
                    width: BAR_WIDTH,
                  }}
                />
              );
            })}
          </div>

          {/* Labels */}
          <div className="relative min-w-0 flex-1" style={{ height: axisHeight }}>
            {datedExperiences.map((e) => {
              const barTop = topPx(e.end);
              const barHeight = (e.end - e.start + 1) * MONTH_PX;
              return (
                <div
                  key={e.title}
                  className="absolute left-5 right-0 -translate-y-1/2 sm:left-8"
                  style={{ top: barTop + e.labelAt * barHeight }}
                >
                  <h2 className="text-base font-semibold leading-6 text-foreground sm:text-lg">
                    {e.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
                  <p className="mt-1 text-sm font-medium text-horizon">
                    {e.datesDisplay}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Undated entries */}
        <div className="mt-16 border-t border-border/40 pt-10">
          <ul className="space-y-8">
            {undatedExperiences.map((e) => (
              <li key={e.title} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary/70 shadow-md shadow-primary/50"
                />
                <div>
                  <h2 className="text-base font-semibold leading-6 text-foreground sm:text-lg">
                    {e.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
