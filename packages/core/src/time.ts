// Rule: instants are stored and compared in UTC (ISO strings ending in "Z" /
// Postgres timestamptz). A "day" is always a calendar date in someone's time
// zone (a provider's, or the platform's), never the server's.

// Used for platform-wide things like design seasons.
export const PLATFORM_TIME_ZONE = "Africa/Lagos";

// "YYYY-MM-DD" calendar date in a time zone.
export type LocalDate = string;

const dateFormatters = new Map<string, Intl.DateTimeFormat>();
const partFormatters = new Map<string, Intl.DateTimeFormat>();

function memo(cache: Map<string, Intl.DateTimeFormat>, timeZone: string, make: () => Intl.DateTimeFormat) {
  let f = cache.get(timeZone);
  if (!f) cache.set(timeZone, (f = make()));
  return f;
}

export function isTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone });
    return true;
  } catch {
    return false;
  }
}

// The calendar date an instant falls on in a time zone (en-CA formats as YYYY-MM-DD).
export function localDate(instant: Date, timeZone: string): LocalDate {
  return memo(dateFormatters, timeZone, () => new Intl.DateTimeFormat("en-CA", { timeZone })).format(instant);
}

// How far the zone's wall clock is ahead of UTC at an instant, in ms.
function offsetMs(instant: Date, timeZone: string): number {
  const f = memo(
    partFormatters,
    timeZone,
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
  );
  const p = Object.fromEntries(f.formatToParts(instant).map((x) => [x.type, Number(x.value)]));
  const wall = Date.UTC(p.year!, p.month! - 1, p.day!, p.hour!, p.minute!, p.second!);
  return wall - Math.floor(instant.getTime() / 1000) * 1000;
}

// The UTC instant at which a local date begins (handles DST shifts).
export function startOfLocalDay(date: LocalDate, timeZone: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const midnightAsUtc = Date.UTC(y!, m! - 1, d!);
  let instant = midnightAsUtc - offsetMs(new Date(midnightAsUtc), timeZone);
  const corrected = offsetMs(new Date(instant), timeZone);
  if (midnightAsUtc - corrected !== instant) instant = midnightAsUtc - corrected;
  return new Date(instant);
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d! + days)).toISOString().slice(0, 10);
}

// Inclusive range of local dates in one time zone.
export interface LocalDateRange {
  from: LocalDate;
  to: LocalDate;
  timeZone: string;
}

// The last `days` calendar days in a zone, including today.
export function lastLocalDays(days: number, timeZone: string, now = new Date()): LocalDateRange {
  const to = localDate(now, timeZone);
  return { from: addDays(to, -(days - 1)), to, timeZone };
}

// The UTC instants covering a local range: [start, end).
export function utcBounds({ from, to, timeZone }: LocalDateRange): { start: Date; end: Date } {
  return { start: startOfLocalDay(from, timeZone), end: startOfLocalDay(addDays(to, 1), timeZone) };
}

export function eachLocalDate({ from, to }: Pick<LocalDateRange, "from" | "to">): LocalDate[] {
  const dates: LocalDate[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) dates.push(d);
  return dates;
}

// The last `lookback` calendar days that have fully ended in a zone as of `now`.
// For the daily stats roll-up: it can run at any fixed UTC time (ideally when the
// database is already awake) and still uses each zone's own day boundaries.
// Recomputing a few days each run picks up late events and recovers missed runs.
export function completedLocalDays(timeZone: string, lookback: number, now = new Date()): LocalDateRange {
  const to = addDays(localDate(now, timeZone), -1);
  return { from: addDays(to, -(lookback - 1)), to, timeZone };
}
