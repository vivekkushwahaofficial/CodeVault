import type {
  RepositoryIndex,
} from "./types";

/**
 * Generates a GitHub-style coding activity
 * heatmap from solution solved dates.
 *
 * The heatmap represents the 365-day period
 * ending on the latest solved date.
 *
 * No external services are required.
 */
export function generateActivityHeatmap(
  index: RepositoryIndex,
): string {

  const dailyCounts =
    collectDailyCounts(index);

  if (
    dailyCounts.size === 0
  ) {
    return generateEmptyHeatmap();
  }

  const latestDate =
    getLatestDate(dailyCounts);

  const endDate =
    endOfWeek(latestDate);

  const startDate =
    startOfWeek(
      addDays(
        endDate,
        -364,
      ),
    );

  const weeks =
    generateWeeks(
      startDate,
      endDate,
    );

  const maximumCount =
    Math.max(
      ...dailyCounts.values(),
      0,
    );

  const width =
    Math.max(
      720,
      70 +
        weeks.length * 14,
    );

  const height =
    150;

  const cellSize =
    10;

  const cellGap =
    3;

  const cellStep =
    cellSize +
    cellGap;

  const gridX =
    45;

  const gridY =
    25;

  const cells: string[] = [];

  weeks.forEach(
    (week, weekIndex) => {

      week.forEach(
        (date, dayIndex) => {

          const key =
            toDateKey(date);

          const count =
            dailyCounts.get(key) ??
            0;

          const x =
            gridX +
            weekIndex * cellStep;

          const y =
            gridY +
            dayIndex * cellStep;

          const level =
            getActivityLevel(
              count,
              maximumCount,
            );

          cells.push(
            [
              `<rect`,
              `x="${x}"`,
              `y="${y}"`,
              `width="${cellSize}"`,
              `height="${cellSize}"`,
              `rx="2"`,
              `fill="${getLevelColor(level)}"`,
              `>`,
              `<title>${key}: ${count} ${count === 1 ? "solution" : "solutions"}</title>`,
              `</rect>`,
            ].join(" "),
          );
        },
      );
    },
  );

  const monthLabels =
    generateMonthLabels(
      startDate,
      endDate,
      gridX,
      cellStep,
    );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg`,
    `xmlns="http://www.w3.org/2000/svg"`,
    `width="${width}"`,
    `height="${height}"`,
    `viewBox="0 0 ${width} ${height}"`,
    `role="img"`,
    `aria-labelledby="title description"`,
    `>`,
    `<title id="title">CodeVault Coding Activity</title>`,
`<desc id="description">Daily coding solution activity for the latest year represented in the CodeVault repository.</desc>`,    `<rect width="100%" height="100%" fill="#0d1117" rx="8"/>`,
    `<text x="45" y="15" fill="#8b949e" font-family="Arial, sans-serif" font-size="10">`,
    `Coding Activity`,
    `</text>`,
    monthLabels,
    cells.join(""),
    generateWeekdayLabels(
      gridY,
      cellStep,
    ),
    generateLegend(
      width,
      height,
    ),
    `</svg>`,
  ].join("");
}

/**
 * Collects solution counts by calendar date.
 */
function collectDailyCounts(
  index: RepositoryIndex,
): Map<string, number> {

  const counts =
    new Map<string, number>();

  for (
    const solution of index.solutions
  ) {

    if (
      !solution.solvedAt
    ) {
      continue;
    }

    const date =
      new Date(
        solution.solvedAt,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      continue;
    }

    const key =
      toDateKey(date);

    counts.set(
      key,
      (counts.get(key) ?? 0) + 1,
    );
  }

  return counts;
}

/**
 * Returns the latest solved date.
 */
function getLatestDate(
  counts: Map<string, number>,
): Date {

  let latest =
    new Date(0);

  for (
    const key of counts.keys()
  ) {

    const date =
      fromDateKey(key);

    if (
      date.getTime() >
      latest.getTime()
    ) {
      latest = date;
    }
  }

  return latest;
}

/**
 * Generates all weeks between two dates.
 */
function generateWeeks(
  startDate: Date,
  endDate: Date,
): Date[][] {

  const weeks: Date[][] = [];

  let current =
    new Date(
      startDate,
    );

  while (
    current.getTime() <=
    endDate.getTime()
  ) {

    const week: Date[] = [];

    for (
      let day = 0;
      day < 7;
      day++
    ) {

      week.push(
        new Date(
          current,
        ),
      );

      current =
        addDays(
          current,
          1,
        );
    }

    weeks.push(
      week,
    );
  }

  return weeks;
}

/**
 * Converts a date to YYYY-MM-DD.
 */
function toDateKey(
  date: Date,
): string {

  return [
    date.getUTCFullYear(),
    String(
      date.getUTCMonth() + 1,
    ).padStart(2, "0"),
    String(
      date.getUTCDate(),
    ).padStart(2, "0"),
  ].join("-");
}

/**
 * Converts YYYY-MM-DD to a UTC Date.
 */
function fromDateKey(
  value: string,
): Date {

  return new Date(
    `${value}T00:00:00.000Z`,
  );
}

/**
 * Adds days without mutating the original date.
 */
function addDays(
  date: Date,
  days: number,
): Date {

  const result =
    new Date(
      date,
    );

  result.setUTCDate(
    result.getUTCDate() +
      days,
  );

  return result;
}

/**
 * Returns the Sunday at the beginning
 * of the week containing the date.
 */
function startOfWeek(
  date: Date,
): Date {

  const result =
    new Date(
      date,
    );

  result.setUTCDate(
    result.getUTCDate() -
      result.getUTCDay(),
  );

  return result;
}

/**
 * Returns the Saturday at the end
 * of the week containing the date.
 */
function endOfWeek(
  date: Date,
): Date {

  return addDays(
    startOfWeek(date),
    6,
  );
}

/**
 * Determines heatmap intensity.
 */
function getActivityLevel(
  count: number,
  maximumCount: number,
): number {

  if (
    count === 0 ||
    maximumCount === 0
  ) {
    return 0;
  }

  const ratio =
    count /
    maximumCount;

  if (
    ratio <= 0.25
  ) {
    return 1;
  }

  if (
    ratio <= 0.5
  ) {
    return 2;
  }

  if (
    ratio <= 0.75
  ) {
    return 3;
  }

  return 4;
}

/**
 * Returns the heatmap color for a level.
 */
function getLevelColor(
  level: number,
): string {

  const colors = [
    "#161b22",
    "#0e4429",
    "#006d32",
    "#26a641",
    "#39d353",
  ];

  return (
    colors[level] ??
    colors[0] ??
    "#161b22"
  );
}

/**
 * Generates month labels.
 */
function generateMonthLabels(
  startDate: Date,
  endDate: Date,
  gridX: number,
  cellStep: number,
): string {

  const labels: string[] = [];

  let current =
    new Date(
      startDate,
    );

  let previousMonth =
    -1;

  while (
    current.getTime() <=
    endDate.getTime()
  ) {

    const month =
      current.getUTCMonth();

    if (
      month !== previousMonth &&
      current.getUTCDay() === 0
    ) {

      const weekIndex =
        Math.floor(
          (
            current.getTime() -
            startDate.getTime()
          ) /
            (
              7 *
              24 *
              60 *
              60 *
              1000
            ),
        );

      labels.push(
        [
          `<text`,
          `x="${gridX + weekIndex * cellStep}"`,
          `y="20"`,
          `fill="#8b949e"`,
          `font-family="Arial, sans-serif"`,
          `font-size="9"`,
          `>`,
          getMonthName(month),
          `</text>`,
        ].join(" "),
      );

      previousMonth =
        month;
    }

    current =
      addDays(
        current,
        1,
      );
  }

  return labels.join("");
}

/**
 * Generates weekday labels.
 */
function generateWeekdayLabels(
  gridY: number,
  cellStep: number,
): string {

  return [
    `<text x="8" y="${gridY + cellStep * 1}" fill="#8b949e" font-family="Arial, sans-serif" font-size="8">Mon</text>`,
    `<text x="8" y="${gridY + cellStep * 3}" fill="#8b949e" font-family="Arial, sans-serif" font-size="8">Wed</text>`,
    `<text x="8" y="${gridY + cellStep * 5}" fill="#8b949e" font-family="Arial, sans-serif" font-size="8">Fri</text>`,
  ].join("");
}

/**
 * Generates the heatmap legend.
 */
function generateLegend(
  width: number,
  height: number,
): string {

  const labels = [
    "Less",
    "More",
  ];

  const startX =
    width - 125;

  const y =
    height - 13;

  const cells = [
    0,
    1,
    2,
    3,
    4,
  ].map(
    (level, index) =>
      `<rect x="${startX + 28 + index * 13}" y="${y - 8}" width="10" height="10" rx="2" fill="${getLevelColor(level)}"/>`,
  );

  return [
    `<text x="${startX}" y="${y}" fill="#8b949e" font-family="Arial, sans-serif" font-size="8">${labels[0]}</text>`,
    cells.join(""),
    `<text x="${startX + 95}" y="${y}" fill="#8b949e" font-family="Arial, sans-serif" font-size="8">${labels[1]}</text>`,
  ].join("");
}

/**
 * Returns a short month name.
 */
function getMonthName(
  month: number,
): string {

  const months = [
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

  return (
    months[month] ??
    ""
  );
}

/**
 * Generates an empty heatmap when
 * no valid solved dates exist.
 */
function generateEmptyHeatmap(): string {

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg`,
    `xmlns="http://www.w3.org/2000/svg"`,
    `width="720"`,
    `height="80"`,
    `viewBox="0 0 720 80"`,
    `role="img"`,
    `aria-label="No coding activity yet"`,
    `>`,
    `<rect width="100%" height="100%" fill="#0d1117" rx="8"/>`,
    `<text x="360" y="44" text-anchor="middle" fill="#8b949e" font-family="Arial, sans-serif" font-size="12">`,
    `No coding activity yet`,
    `</text>`,
    `</svg>`,
  ].join("");
}