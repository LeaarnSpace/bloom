import { PLATFORM_TIME_ZONE, localDate } from "@bloom/core";

export const DESIGN_COOKIE = "bloom-design";
export const AUTO_DESIGN = "auto";

// start/end are "MM-DD" for a rule that repeats every year (ranges may wrap
// past New Year), or "YYYY-MM-DD" for a one-off campaign. Both ends inclusive.
// Earlier rules win when ranges overlap.
export interface SeasonRule {
  design: string;
  start: string;
  end: string;
}

function inRange(today: string, start: string, end: string): boolean {
  return start <= end ? today >= start && today <= end : today >= start || today <= end;
}

export function activeSeason(rules: SeasonRule[], now: Date): string | undefined {
  const date = localDate(now, PLATFORM_TIME_ZONE);
  const monthDay = date.slice(5);
  return rules.find((r) => {
    const yearly = r.start.length === 5;
    return inRange(yearly ? monthDay : date, r.start, r.end);
  })?.design;
}

export interface ResolveInput {
  cookie: string | undefined;
  seasons: SeasonRule[];
  available: string[];
  fallback: string;
  now?: Date;
}

// Precedence: explicit user choice (cookie) > active season > fallback.
export function resolveDesignId({ cookie, seasons, available, fallback, now = new Date() }: ResolveInput): string {
  if (cookie && cookie !== AUTO_DESIGN && available.includes(cookie)) return cookie;
  const seasonal = activeSeason(seasons, now);
  if (seasonal && available.includes(seasonal)) return seasonal;
  return fallback;
}
