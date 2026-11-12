import type { DesignEntry, SeasonRule } from "@bloom/design-kit";

// To add a design: create a folder exporting DesignComponents, then add one entry here.
export const designs: DesignEntry[] = [
  { id: "warm", label: "Warm", load: () => import("./warm").then((m) => m.default) },
  { id: "clean", label: "Clean", load: () => import("./clean").then((m) => m.default) },
];

// Shown when the visitor has no cookie and no season is active.
export const defaultDesignId = "clean";

// Shown to everyone whose cookie is unset or "auto" while the range is active (Lagos time).
// Format "MM-DD" (every year) or "YYYY-MM-DD". Example:
//   { design: "warm", start: "12-15", end: "01-05" }
export const seasons: SeasonRule[] = [];

export function isKnownDesign(id: string): boolean {
  return designs.some((d) => d.id === id);
}
