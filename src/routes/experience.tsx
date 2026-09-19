import { useEffect, useRef, useState } from "react";
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

const MONTH_PX = 22.5;
const TRACK_GAP = 26;
const BAR_WIDTH = 10;
const LABEL_GAP = 99;
/** px of breathing room between the connector's end and the label's edge (0 = touches) */
const LABEL_GAP_FROM_LABEL = 0;
/** px below the bar's top tip (= end date) where the connector attaches */
const CONNECTOR_OFFSET = MONTH_PX / 2;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** year * 12 + (month - 1) */
function monthIndex(year: number, month: number) {
  return year * 12 + (month - 1);
}

/**
 * Fractional month position of a date tuple on the axis.
 * Start: no day = the month's first day; with day = that day into the month.
 * End: no day = the month's last day (start of the next month);
 * with day = that day into the month.
 */
function toPosition(tuple: [number, number] | [number, number, number], kind: "start" | "end") {
  const base = monthIndex(tuple[0], tuple[1]);
  const day = tuple[2];
  if (day !== undefined) return base + (day - 1) / 30;
  return kind === "start" ? base : base + 1;
}

function formatMonth(index: number) {
  return `${MONTHS[Math.floor(index) % 12]} ${Math.floor(Math.floor(index) / 12)}`;
}

/**
 * Add a new experience here and the timeline places it automatically:
 * its bar spans the given months, it gets a free track, a side of the spine,
 * its colour (purple = volunteer, blue = otherwise) and a connector.
 */
type ExperienceInput = {
  /** unique key; only needed when two entries share the same title */
  id?: string;
  title: string;
  org: string;
  /** [year, month] or [year, month, day] — month is 1-12 */
  start?: [number, number] | [number, number, number];
  /** same shape as start — omit for a single-month role */
  end?: [number, number] | [number, number, number];
  /** shown instead of the auto-formatted start - end dates (e.g. "Summer of 2022") */
  displayDates?: string;
  volunteer?: boolean;
};

const experiences: ExperienceInput[] = [
  {
    title: "Graduate Research Student",
    org: "University of Waterloo",
    start: [2024, 9],
    end: [2026, 4],
  },
  {
    title: "Teaching Assistant",
    org: "University of Waterloo",
    start: [2024, 9],
    end: [2026, 4],
  },
  {
    title: "Tech Support (volunteer)",
    org: "University of Waterloo Teaching and Learning Conference",
    start: [2025, 4],
    volunteer: true,
  },
  {
    id: "amirkabir-2022",
    title: "Teaching Assistant (volunteer)",
    org: "Amirkabir University of Technology (Tehran Polytechnic)",
    start: [2022, 9, 22],
    end: [2023, 1, 22],
    displayDates: "1st Semester of 2022-2023",
    volunteer: true,
  },
  {
    id: "amirkabir-2023",
    title: "Teaching Assistant (volunteer)",
    org: "Amirkabir University of Technology (Tehran Polytechnic)",
    start: [2023, 9, 22],
    end: [2024, 1, 22],
    displayDates: "1st Semester of 2023-2024",
    volunteer: true,
  },
  {
    title: "Science Writer (volunteer)",
    org: "Halgheh Student Science Magazine",
    start: [2022, 6, 22],
    end: [2022, 9, 22],
    displayDates: "Summer of 2022",
    volunteer: true,
  },
];

type Dated = {
  id: string;
  title: string;
  org: string;
  datesDisplay: string;
  start: number;
  end: number;
  volunteer: boolean;
  track: number;
  side: "left" | "right";
};

const palette = {
  blue: {
    bar: "bg-horizon/80 shadow-[0_0_14px_2px] shadow-horizon/40",
    date: "text-horizon",
    right: "bg-gradient-to-r from-horizon/90 to-horizon/0",
    left: "bg-gradient-to-l from-horizon/90 to-horizon/0",
    node: "bg-horizon shadow-[0_0_8px_2px] shadow-horizon/60",
    dot: "bg-horizon/70 shadow-md shadow-horizon/50",
  },
  purple: {
    bar: "bg-primary/80 shadow-[0_0_14px_2px] shadow-primary/40",
    date: "text-primary",
    right: "bg-gradient-to-r from-primary/90 to-primary/0",
    left: "bg-gradient-to-l from-primary/90 to-primary/0",
    node: "bg-primary shadow-[0_0_8px_2px] shadow-primary/60",
    dot: "bg-primary/70 shadow-md shadow-primary/50",
  },
};

/** permutations of [0..n-1] */
function permutations(n: number): number[][] {
  if (n <= 1) return [[0]];
  const out: number[][] = [];
  const rest = permutations(n - 1);
  for (const p of rest) {
    for (let i = 0; i <= p.length; i++) {
      out.push([...p.slice(0, i), n - 1, ...p.slice(i)]);
    }
  }
  return out;
}

/** greedy interval colouring: overlapping bars never share a track */
function assignTracks(items: Omit<Dated, "track" | "side">[]) {
  const trackEnds: number[] = [];
  const tracks: number[] = [];
  const order = items
    .map((e, i) => i)
    .sort((a, b) => items[a]!.start - items[b]!.start || items[a]!.end - items[b]!.end);
  for (const i of order) {
    const e = items[i]!;
    // months are inclusive, so a shared month counts as an overlap
    let t = trackEnds.findIndex((end) => end < e.start);
    if (t === -1) {
      t = trackEnds.length;
      trackEnds.push(e.end);
    } else {
      trackEnds[t] = e.end;
    }
    tracks[i] = t;
  }
  return { tracks, trackCount: trackEnds.length };
}

/** side of the spine for a track, given how many tracks sit on the left */
function defaultSide(track: number, leftTracks: number): "left" | "right" {
  return track < leftTracks ? "left" : "right";
}

/**
 * arrangement score: connector crossings dominate; chronologically
 * consecutive experiences on the same side add a smaller penalty so
 * neighbours alternate sides when possible
 */
function scoreArrangement(items: Dated[]) {
  const trackCount = Math.max(...items.map((item) => item.track)) + 1;
  const leftTracks = Math.ceil(trackCount / 2);

  // A label must stay on the outward-facing side of its bar. Allowing an
  // independently chosen side can send its connector through the spine.
  if (items.some((item) => item.side !== defaultSide(item.track, leftTracks))) {
    return Number.POSITIVE_INFINITY;
  }

  let count = 0;
  for (const e of items) {
    const y = e.end; // connector sits just under the end date
    for (const other of items) {
      if (other === e) continue;
      const between =
        e.side === "left" ? other.track < e.track : other.track > e.track;
      if (between && other.start <= y && other.end >= y) count++;
    }
  }
  const chronological = [...items].sort(
    (a, b) => a.start - b.start || a.end - b.end
  );
  let sameSideRuns = 0;
  for (let i = 1; i < chronological.length; i++) {
    if (chronological[i - 1]!.side === chronological[i]!.side) sameSideRuns++;
  }
  return count * 100 + sameSideRuns;
}

function buildLayout() {
  const dated: Omit<Dated, "track" | "side">[] = [];
  const undated: { id: string; title: string; org: string; volunteer: boolean }[] = [];

  for (const e of experiences) {
    const volunteer = Boolean(e.volunteer);
    const id = e.id ?? e.title;
    if (!e.start) {
      undated.push({ id, title: e.title, org: e.org, volunteer });
      continue;
    }
    const start = toPosition(e.start, "start");
    const end = e.end ? toPosition(e.end, "end") : toPosition(e.start, "end");
    dated.push({
      id,
      title: e.title,
      org: e.org,
      volunteer,
      start,
      end,
      datesDisplay:
        e.displayDates ??
        (start === end
          ? formatMonth(start)
          : `${formatMonth(start)} - ${formatMonth(end)}`),
    });
  }

  const { tracks, trackCount } = assignTracks(dated);
  const leftTracks = Math.ceil(trackCount / 2);

  // Try every track relabelling and side assignment. Invalid inward-facing
  // connectors are rejected, then crossings and side repetition are minimized.
  let best: Dated[] = dated.map((e, i) => ({
    ...e,
    track: tracks[i]!,
    side: defaultSide(tracks[i]!, leftTracks),
  }));
  let bestScore = scoreArrangement(best);
  // exhaustive side search is only worthwhile for a small number of entries
  const sideCombos = dated.length <= 12 ? 1 << dated.length : 1;
  for (const perm of permutations(trackCount)) {
    for (let mask = 0; mask < sideCombos; mask++) {
      const candidate: Dated[] = dated.map((e, i) => ({
        ...e,
        track: perm[tracks[i]!]!,
        side: (mask >> i) & 1 ? "right" : "left",
      }));
      const score = scoreArrangement(candidate);
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
  }

  return { dated: best, undated, trackCount, leftTracks };
}

function ExperiencePage() {
  const { dated, undated, trackCount, leftTracks } = buildLayout();

  // measure the timeline so connectors and gaps can shrink on small screens
  const axisRef = useRef<HTMLDivElement>(null);
  const [axisWidth, setAxisWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = axisRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setAxisWidth(entries[0]!.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // pad the axis down to January so every fully-shown year spans the same height
  const min = Math.floor(Math.min(...dated.map((e) => e.start)) / 12) * 12;
  const max = Math.max(...dated.map((e) => e.end));
  const axisHeight = (max - min + 1) * MONTH_PX;

  const topPx = (month: number) => (max - month) * MONTH_PX;

  // on narrow screens the tracks pull closer together and the connectors
  // shorten so each label keeps room to breathe (and wrap if it must)
  const trackGap = axisWidth !== null && axisWidth < 640 ? 18 : TRACK_GAP;
  const railWidth = (trackCount - 1) * trackGap + BAR_WIDTH + 8;
  // spine runs between the last left track and the first right track
  const spineX = 4 + (leftTracks - 0.5) * trackGap + BAR_WIDTH / 2;
  const sideSpace = axisWidth !== null ? (axisWidth - railWidth) / 2 : Infinity;
  const labelGap =
    axisWidth !== null ? Math.max(24, Math.min(LABEL_GAP, sideSpace - 120)) : LABEL_GAP;

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

        <div ref={axisRef} className="relative" style={{ height: axisHeight }}>
          {/* Subtle lines marking each year boundary, behind everything */}
          {years.map(({ year, top }) => (
            <div
              key={`yearline-${year}`}
              aria-hidden
              className="absolute left-0 right-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border/50 to-transparent"
              style={{ top }}
            />
          ))}

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
            {dated.map((e) => {
              const colors = e.volunteer ? palette.purple : palette.blue;
              const side = e.side;
              const top = topPx(e.end);
              const height = (e.end - e.start + 1) * MONTH_PX;
              const labelY = top + CONNECTOR_OFFSET;
              const barLeft = 4 + e.track * trackGap;
              const barRight = barLeft + BAR_WIDTH;
              return (
                <div key={e.id} aria-hidden>
                  <div
                    className={`absolute rounded-full ${colors.bar}`}
                    style={{ top, height, left: barLeft, width: BAR_WIDTH }}
                  />
                  {/* connector from bar to its label — always the same length */}
                  {side === "right" ? (
                    <div
                      className={`absolute h-px ${colors.right}`}
                      style={{ left: barRight, top: labelY, width: labelGap }}
                    />
                  ) : (
                    <div
                      className={`absolute h-px ${colors.left}`}
                      style={{ left: barLeft - labelGap, top: labelY, width: labelGap }}
                    />
                  )}
                  {/* glowing node where the connector meets the bar */}
                  <div
                    className={`absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${colors.node}`}
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

          {/* Labels, on their track's side of the spine */}
          {dated.map((e) => {
            const colors = e.volunteer ? palette.purple : palette.blue;
            const side = e.side;
            const barTop = topPx(e.end);
            const barLeft = 4 + e.track * trackGap;
            const barRight = barLeft + BAR_WIDTH;
            // labels stay on one line when there's room; they wrap onto
            // multiple lines on narrower screens instead of overflowing
            const wrap = axisWidth !== null && axisWidth < 900;
            return (
              <div
                key={e.id}
                className={`absolute -translate-y-3 ${side === "left" ? "text-right" : "text-left"}`}
                style={{
                  top: barTop + CONNECTOR_OFFSET,
                  ...(wrap ? {} : { width: "max-content" }),
                  ...(side === "left"
                    ? {
                        right: `calc(50% + ${railWidth / 2 - barLeft + labelGap + LABEL_GAP_FROM_LABEL}px)`,
                      }
                    : {
                        left: `calc(50% + ${barRight + labelGap + LABEL_GAP_FROM_LABEL - railWidth / 2}px)`,
                      }),
                }}
              >
                <h2 className="text-base font-semibold leading-6 text-foreground sm:text-lg">
                  {e.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
                <p className={`mt-1 text-sm font-medium ${colors.date}`}>{e.datesDisplay}</p>
              </div>
            );
          })}
        </div>

        {/* Undated entries */}
        <div className="mt-16 border-t border-border/40 pt-10">
          <ul className="space-y-8">
            {undated.map((e) => (
                <li key={e.id} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                    e.volunteer ? palette.purple.dot : palette.blue.dot
                  }`}
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
