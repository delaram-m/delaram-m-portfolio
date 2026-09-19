# Fix Experience timeline ordering

The timeline on /experience lists entries in the order they were added, which is not chronological — Tech Support (Apr 2025) currently sits below the older Amirkabir role. The Waterloo roles overlapping each other is intentional and stays as-is.

## What will change

1. **Structured dates**: Each experience entry gets machine-readable start/end dates (year + month) stored alongside its title/org/display text — the same approach the Trainings page uses for its automatic sorting.

2. **Automatic sorting, newest first**: The timeline sorts itself by date (most recent end date at the top), so new roles land in the right place automatically regardless of the order they're added in.

3. **Dates for the undated roles**:
   - Teaching Assistant (volunteer), Amirkabir University of Technology — display: "1st Semester of 2022-2023 & 1st Semester of 2023-2024"; internal sort dates Sep 2022 - Jan 2024.
   - Science Writer (volunteer), Halgheh Student Science Magazine — display: "Summer 2022"; internal sort date Jun-Aug 2022.

## Resulting order (top to bottom)

1. Graduate Research Student — Sep 2024 - Apr 2026
2. Teaching Assistant (Waterloo) — Sep 2024 - Apr 2026
3. Tech Support (volunteer) — Apr 2025
4. Teaching Assistant (volunteer), Amirkabir — 2022-2023 & 2023-2024
5. Science Writer (volunteer) — Summer 2022

## Technical details

- Edit only `src/routes/experience.tsx`.
- Replace the hardcoded `<ExperienceEntry>` list with a data array containing `title`, `org`, `datesDisplay`, and `sortEnd` (and `sortStart`) values; sort by `sortEnd` descending before rendering.
- Long Amirkabir date text wraps onto two lines in the date column.
- Visual style (vertical rail, glowing dots, date column) is unchanged.
- Verify with a build check and a Playwright screenshot of /experience.
