// "coming-soon" (default): only the pre-launch page is public; other public
// pages redirect to "/". "full": the whole site. The provider dashboard is
// available in both modes.
export type SiteMode = "coming-soon" | "full";

export function siteMode(): SiteMode {
  return process.env.SITE_MODE === "full" ? "full" : "coming-soon";
}
