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
const LABEL_GAP = 24;

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
  /** which side of the central rail the label sits on */
  side: "left" | "right";
  barClass: string;
  dateClass: string;
  /** connector fading toward a label on the right */
  connectorClass: string;
  /** connector fading toward a label on the left */
  connectorLeftClass: string;
  nodeClass: string;
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
    track: 1,
    labelAt: 0.15,
    side: "left",
    barClass: "bg-horizon/80 shadow-[0_0_14px_2px] shadow-horizon/40",
    dateClass: "text-horizon",
    connectorClass: "bg-gradient-to-r from-horizon/70 to-horizon/10",
    connectorLeftClass: "bg-gradient-to-l from-horizon/70 to-horizon/10",
    nodeClass: "bg-horizon shadow-[0_0_8px_2px] shadow-horizon/60",
  },
  {
    title: "Teaching Assistant",
    org: "University of Waterloo",
    datesDisplay: "Sep 2024 - Apr 2026",
    start: monthIndex(2024, 9),
    end: monthIndex(2026, 4),
    track: 2,
    labelAt: 0.15,
    side: "right",
    barClass: "bg-horizon/80 shadow-[0_0_14px_2px] shadow-horizon/40",
    dateClass: "text-horizon",
    connectorClass: "bg-gradient-to-r from-horizon/70 to-horizon/10",
    connectorLeftClass: "bg-gradient-to-l from-horizon/70 to-horizon/10",
    nodeClass: "bg-horizon shadow-[0_0_8px_2px] shadow-horizon/60",
  },
  {
    title: "Tech Support (volunteer)",
    org: "University of Waterloo Teaching and Learning Conference",
    datesDisplay: "Apr 2025",
    start: monthIndex(2025, 4),
    end: monthIndex(2025, 4),
    track: 0,
    labelAt: 0.5,
    side: "left",
    barClass: "bg-primary/80 shadow-[0_0_14px_2px] shadow-primary/40",
    dateClass: "text-primary",
    connectorClass: "bg-gradient-to-r from-primary/70 to-primary/10",
    connectorLeftClass: "bg-gradient-to-l from-primary/70 to-primary/10",
    nodeClass: "bg-primary shadow-[0_0_8px_2px] shadow-primary/60",
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

  // vertical center of each label, used to keep year markers clear of them
  const labelYs = datedExperiences.map(
    (e) => topPx(e.end) + e.labelAt * (e.end - e.start + 1) * MONTH_PX
  );
  const sideBusy = (side: "left" | "right", top: number) =>
    datedExperiences.some((e, i) => e.side === side && Math.abs((labelYs[i] ?? -10000) - top) < 44);

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

        <div className="relative" style={{ height: axisHeight }}>
          {/* Full-width year grid lines */}
          {years.map(({ year, top }) => (
            <div
              key={year}
              aria-hidden
              className="absolute left-0 right-0 border-t border-border/30"
              style={{ top }}
            />
          ))}

          {/* Central rail with span bars */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{ width: railWidth, height: axisHeight }}
          >
            <div
              aria-hidden
              className="absolute bottom-0 top-0 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/40 via-horizon/30 to-primary/10"
              style={{ left: railWidth / 2 }}
            />
            {datedExperiences.map((e) => {
              const top = topPx(e.end);
              const height = (e.end - e.start + 1) * MONTH_PX;
              const labelY = top + e.labelAt * height;
              const barLeft = 4 + e.track * TRACK_GAP;
              const barRight = barLeft + BAR_WIDTH;
              const rightConnectorWidth = railWidth + LABEL_GAP - barRight - 10;
              const leftConnectorWidth = barLeft + LABEL_GAP - 10;
              return (
                <div key={e.title} aria-hidden>
                  <div
                    className={`absolute rounded-full ${e.barClass}`}
                    style={{ top, height, left: barLeft, width: BAR_WIDTH }}
                  />
                  {/* connector from bar to its label */}
                  {e.side === "right" ? (
                    <div
                      className={`absolute h-px ${e.connectorClass}`}
                      style={{ left: barRight, top: labelY, width: rightConnectorWidth }}
                    />
                  ) : (
                    <div
                      className={`absolute h-px ${e.connectorLeftClass}`}
                      style={{
                        left: barLeft - leftConnectorWidth,
                        top: labelY,
                        width: leftConnectorWidth,
                      }}
                    />
                  )}
                  {/* glowing node where the connector meets the bar */}
                  <div
                    className={`absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${e.nodeClass}`}
                    style={{ left: barLeft + BAR_WIDTH / 2, top: labelY }}
                  />
                </div>
              );
            })}
          </div>

          {/* Year markers, near the rail when free, otherwise at the outer edge */}
          {years.map(({ year, top }) => {
            const side: "left" | "right" | null = sideBusy("left", top)
              ? sideBusy("right", top)
                ? null
                : "right"
              : "left";
            return (
              <span
                key={year}
                aria-hidden
                className="absolute -translate-y-1/2 bg-background px-1 text-xs font-medium text-muted-foreground"
                style={
                  side === "left"
                    ? { top, right: `calc(50% + ${railWidth / 2 + 8}px)` }
                    : side === "right"
                      ? { top, left: `calc(50% + ${railWidth / 2 + 8}px)` }
                      : { top, left: 0 }
                }
              >
                {year}
              </span>
            );
          })}

          {/* Labels, alternating sides of the rail */}
          {datedExperiences.map((e) => {
            const barTop = topPx(e.end);
            const barHeight = (e.end - e.start + 1) * MONTH_PX;
            return (
              <div
                key={e.title}
                className={`absolute -translate-y-1/2 ${
                  e.side === "left" ? "text-right" : "text-left"
                }`}
                style={{
                  top: barTop + e.labelAt * barHeight,
                  width: `calc(50% - ${railWidth / 2 + LABEL_GAP}px)`,
                  ...(e.side === "left" ? { left: 0 } : { right: 0 }),
                }}
              >
                <h2 className="text-base font-semibold leading-6 text-foreground sm:text-lg">
                  {e.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
                <p className={`mt-1 text-sm font-medium ${e.dateClass}`}>
                  {e.datesDisplay}
                </p>
              </div>
            );
          })}
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
