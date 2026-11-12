import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { ImageResponse } from "next/og";

// The site icon: a "B" in Manrope Bold, the logo's font and weight. All three
// files are drawn at build time (their routes are static):
//   /icon.svg        browser tab, ink "B", white in dark mode (Chrome, Firefox, Edge)
//   /icon.png        browser tab fallback, ink "B" (browsers without SVG icons)
//   /apple-icon.png  iOS home screen, ink "B" on white (iOS needs a solid background)

const INK = "#0e1b34";
const ON_DARK = "#ffffff";
const TAB_SIZE = 32;
const TOUCH_SIZE = 180;

// Link order matters: browsers that understand the SVG prefer it over the PNG.
export const siteIcons: Metadata["icons"] = {
  icon: [
    { url: "/icon.png", type: "image/png", sizes: `${TAB_SIZE}x${TAB_SIZE}` },
    { url: "/icon.svg", type: "image/svg+xml" },
  ],
  apple: [{ url: "/apple-icon.png", type: "image/png", sizes: `${TOUCH_SIZE}x${TOUCH_SIZE}` }],
};

// Same Manrope Bold as the site (see assets/README.md).
const manropeBold = () => readFile(join(process.cwd(), "assets/manrope-700.woff"));

async function letterB({ size, color, background }: { size: number; color: string; background?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: background ?? "transparent",
          color,
          fontFamily: "Manrope",
          fontWeight: 700,
          // The capital fills most of a tab icon; the touch icon keeps a margin.
          fontSize: size * (background ? 0.78 : 1.12),
          lineHeight: 1,
          // Optical centring: Manrope's line box sits the capital slightly low,
          // and the B has more space on its left than its right.
          paddingBottom: size * (background ? 0.02 : 0.03),
          paddingRight: size * 0.03,
        }}
      >
        B
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Manrope", data: await manropeBold(), weight: 700, style: "normal" }],
    },
  );
}

export const tabIconPng = () => letterB({ size: TAB_SIZE, color: INK });

export const touchIconPng = () => letterB({ size: TOUCH_SIZE, color: INK, background: "#ffffff" });

// SVG wrapper around two renders of the same "B", switched by the browser's
// colour scheme so the icon stays visible on dark tabs. Rendered at 2x for
// sharp high-density screens.
export async function tabIconSvg(): Promise<string> {
  const size = TAB_SIZE * 2;
  const dataUri = async (color: string) =>
    `data:image/png;base64,${Buffer.from(await (await letterB({ size, color })).arrayBuffer()).toString("base64")}`;
  const [light, dark] = await Promise.all([dataUri(INK), dataUri(ON_DARK)]);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${TAB_SIZE}" height="${TAB_SIZE}">
<style>.dark{display:none}@media (prefers-color-scheme:dark){.light{display:none}.dark{display:inline}}</style>
<image class="light" width="${size}" height="${size}" href="${light}"/>
<image class="dark" width="${size}" height="${size}" href="${dark}"/>
</svg>`;
}
