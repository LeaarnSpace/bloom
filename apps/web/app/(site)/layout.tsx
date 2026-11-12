import type { Metadata } from "next";
import type { ReactNode } from "react";
import { motionBootScript, ScrollReveal } from "@bloom/designs";
import { getActiveDesign } from "@bloom/designs/server";
import { Tracker } from "@bloom/tracking/client";
import { siteMode } from "@/lib/site-mode";
import { setDesign } from "./actions";
import { manrope } from "./fonts";

export const metadata: Metadata = {
  title: "Bloom — Find what helps your child bloom",
  description:
    "Explore how children grow and learn. Find programmes, providers and available dates for your family in Nigeria.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { id, selected, options, ui } = await getActiveDesign();
  // Before launch the design's ComingSoon page owns the whole screen.
  const body =
    siteMode() === "coming-soon" ? (
      children
    ) : (
      <>
        <ui.Shell
          designSwitcher={<ui.DesignSwitcher options={options} selected={selected} activeId={id} action={setDesign} />}
        >
          {children}
        </ui.Shell>
        <Tracker />
      </>
    );
  return (
    // suppressHydrationWarning: the motion boot script adds data-motion to <html> before React loads.
    <html lang="en-NG" data-design={id} className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body style={{ margin: 0 }}>
        {body}
        <ScrollReveal />
      </body>
    </html>
  );
}
