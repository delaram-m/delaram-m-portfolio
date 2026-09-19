# Experience timeline with time-scaled span bars

Show concurrency on /experience: Tech Support (Apr 2025) happened *during* the Waterloo roles (Sep 2024 - Apr 2026). The vertical rail becomes a real time axis where each role draws a bar spanning its actual months, so overlaps are visible by position.

## What will change

### Dated roles: span bars on a true time scale
- The timeline axis covers Sep 2024 to Apr 2026, drawn vertically top (newest) to bottom (oldest).
- Year markers (2024, 2025, 2026) sit along the left of the rail so the scale is readable.
- Each dated role renders as a slim rounded bar on the rail covering its exact months, with its title, organization, and date text to the right, vertically centered on the bar:
  - **Graduate Research Student** — Sep 2024 - Apr 2026 (full-length bar, purple, track 1)
  - **Teaching Assistant, Waterloo** — Sep 2024 - Apr 2026 (full-length bar, blue, parallel track 2)
  - **Tech Support (volunteer)** — Apr 2025 (short single-month bar, third track)
- Because the two Waterloo bars run the full height on parallel tracks, Tech Support's short bar physically sits *inside* their span — the overlap is visible at a glance.
- Bars use the existing theme colors (primary purple / horizon blue) with the same soft glow style as the current dots.

### Undated roles: simple entries below
- Teaching Assistant (volunteer) at Amirkabir and Science Writer (volunteer) stay undated and appear as plain entries below the span-bar section, unchanged for now. (Dates you shared — Amirkabir 1st semesters of 2022-2023 & 2023-2024, Science Writer Summer 2022 — can be added as bars later if you want.)

### Data structure
- Entries move to a data array with `title`, `org`, `datesDisplay`, and structured `startYear/startMonth/endYear/endMonth` fields (nullable for undated entries), so future roles just get added to the array and position themselves automatically.

## Technical details
- Edit only `src/routes/experience.tsx`.
- Month-to-position math: axis height = months in range x fixed px-per-month; each bar absolutely positioned by start/end month as percentages.
- Responsive: on mobile the axis stays vertical with slightly narrower tracks and smaller text; bars and labels remain readable.
- Keeps the existing page header, colors, and reduced-motion friendliness (no animation required).
- Verify with a build check and a Playwright screenshot of /experience on desktop and mobile widths.
