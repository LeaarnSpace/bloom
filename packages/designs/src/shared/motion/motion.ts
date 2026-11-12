import type { CSSProperties } from "react";
import m from "./motion.module.css";

// Attributes shared by the boot script, ScrollReveal and the CSS.
export const MOTION_ATTR = "data-motion"; // on <html>: motion is allowed
export const MOTION_READY_ATTR = "data-motion-ready"; // on <html>: ScrollReveal is running
export const MOTION_INTRO_DONE_ATTR = "data-motion-intro-done"; // on <html>: the page-load entrance has finished
export const INTRO_ATTR = "data-intro"; // on an element: it has a page-load entrance
export const REVEAL_ATTR = "data-reveal"; // on an element: reveal it on scroll
// Set by ScrollReveal: "animate" (scrolled into view), "done" (animation finished)
// or "instant" (already on screen when it appeared).
export const REVEALED_ATTR = "data-revealed";

type MotionProps = { className: string; style?: CSSProperties };

const join = (a: string | undefined, b: string) => (a ? `${a} ${b}` : b);
const delayStyle = (delay?: number) =>
  delay ? ({ "--motion-delay": `${delay}ms` } as CSSProperties) : undefined;

// Page-load entrance for the header and hero. Spread onto the element:
//   <p {...intro("rise", s.lead, 450)}>
export type IntroKind = "drop" | "rise" | "settle" | "words";

const introClass: Record<IntroKind, string> = {
  drop: m.introDrop!,
  rise: m.introRise!,
  settle: m.introSettle!,
  words: m.introWords!,
};

export function intro(kind: IntroKind, className?: string, delay?: number): MotionProps & { [INTRO_ATTR]: "" } {
  return { className: join(className, introClass[kind]), style: delayStyle(delay), [INTRO_ATTR]: "" };
}

// Reveal on scroll. "rise" moves the whole element; "words" moves each <Words>
// word in turn (the element itself stays put).
//   <h2 {...reveal("words", s.title)}><Words text="…" /></h2>
export type RevealKind = "rise" | "words";

export function reveal(kind: RevealKind, className?: string, delay?: number): MotionProps & { [REVEAL_ATTR]: "" } {
  return {
    className: join(className, kind === "words" ? m.revealWords! : m.reveal!),
    style: delayStyle(delay),
    [REVEAL_ATTR]: "",
  };
}
