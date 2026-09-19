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
const LABEL_GAP = 44;

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
  /** px below the bar's top tip where the connector attaches; the label is vertically centered on this point */
  connectorAt: number;
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
    connectorAt: MONTH_PX / 2,
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
    connectorAt: MONTH_PX / 2,
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
    connectorAt: MONTH_PX / 2,
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
  // pad the axis down to January so every fully-shown year spans the same height
  const min = Math.floor(Math.min(...datedExperiences.map((e) => e.start)) / 12) * 12;
  const max = Math.max(...datedExperiences.map((e) => e.end));
  const axisHeight = (max - min + 1) * MONTH_PX;

  const topPx = (month: number) => (max - month) * MONTH_PX;

  const trackCount = Math.max(...datedExperiences.map((e) => e.track)) + 1;
  const railWidth = (trackCount - 1) * TRACK_GAP + BAR_WIDTH + 8;
  // spine runs between the two middle bars (tracks 1 and 2), not through any bar
  const spineX = 4 + 1.5 * TRACK_GAP + BAR_WIDTH / 2;

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

        <div className="relative" style={{ height: axisHeight }}>
          {/* Central rail = the timeline spine, with span bars */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{ width: railWidth, height: axisHeight }}
          >
            <div
              aria-hidden
              className="absolute bottom-0 top-0 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/50 via-horizon/40 to-primary/25"
              style={{ left: spineX }}
            />
            {/* glowing cap at the bottom of the spine */}
            <div
              aria-hidden
              className="absolute h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/70 shadow-[0_0_8px_2px] shadow-primary/40"
              style={{ left: spineX, bottom: 0 }}
            />
            {datedExperiences.map((e) => {
              const top = topPx(e.end);
              const height = (e.end - e.start + 1) * MONTH_PX;
              const labelY = top + e.connectorAt;
              const barLeft = 4 + e.track * TRACK_GAP;
              const barRight = barLeft + BAR_WIDTH;
              // every connector spans exactly LABEL_GAP from its bar to its label
              const rightConnectorWidth = LABEL_GAP;
              const leftConnectorWidth = LABEL_GAP;
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

          {/* Year markers beside the spine */}
          {years.map(({ year, top }) => (
            <span
              key={year}
              aria-hidden
              className="absolute -translate-y-1/2 bg-background px-1 text-xs font-medium text-muted-foreground"
              style={{ top, right: `calc(50% + ${railWidth / 2 + 8}px)` }}
            >
              {year}
            </span>
          ))}

          {/* Labels, alternating sides of the rail */}
          {datedExperiences.map((e) => {
            const barTop = topPx(e.end);
            const barLeft = 4 + e.track * TRACK_GAP;
            const barRight = barLeft + BAR_WIDTH;
            return (
              <div
                key={e.title}
                className={`absolute -translate-y-1/2 ${
                  e.side === "left" ? "text-right" : "text-left"
                }`}
                style={{
                  top: barTop + e.connectorAt,
                  width: `calc(50% - ${railWidth / 2 + LABEL_GAP}px)`,
                  // anchored a fixed LABEL_GAP away from the bar, same distance for all
                  ...(e.side === "left"
                    ? { right: `calc(50% + ${railWidth / 2 - barLeft + LABEL_GAP}px)` }
                    : { left: `calc(50% + ${barRight + LABEL_GAP - railWidth / 2}px)` }),
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
