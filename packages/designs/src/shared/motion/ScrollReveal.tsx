"use client";

import { useEffect } from "react";
import {
  INTRO_ATTR,
  MOTION_ATTR,
  MOTION_INTRO_DONE_ATTR,
  MOTION_READY_ATTR,
  REVEALED_ATTR,
  REVEAL_ATTR,
} from "./motion";

const SELECTOR = `[${REVEAL_ATTR}]`;

function inViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
}

// Resolves when every finite animation on these elements (and inside them) has
// finished or been cancelled. Endless ones, like the hero artwork's loop, are skipped.
function settled(elements: Element[]) {
  const animations = elements
    .flatMap((el) => el.getAnimations({ subtree: true }))
    .filter((a) => a.effect?.getTiming().iterations !== Infinity);
  return Promise.allSettled(animations.map((a) => a.finished));
}

// Collects reveal targets in a node: the node itself and its descendants.
function targetsIn(node: Node): Element[] {
  if (!(node instanceof Element)) return [];
  const found = Array.from(node.querySelectorAll(SELECTOR));
  return node.matches(SELECTOR) ? [node, ...found] : found;
}

// Reveals [data-reveal] elements as they scroll into view, once each.
//
// Render it once, in the layout, so it lives for the whole visit. Elements on
// the page at load animate when they come into view (including those already
// on screen). Elements that appear later, such as after switching designs, show
// at once if they are already on screen, so nothing replays under the visitor's
// eyes; ones further down still animate when scrolled to.
//
// Each animation is retired once it finishes (data-revealed="done", and
// data-motion-intro-done for the page-load entrance). The CSS only animates the
// active states, so nothing can replay later, even if React reuses an element
// for different content after a design switch.
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(MOTION_READY_ATTR, "");
    // No motion (reduced motion, or the boot script's fallback switched it off).
    if (!root.hasAttribute(MOTION_ATTR)) return;

    settled(Array.from(document.querySelectorAll(`[${INTRO_ATTR}]`))).then(() =>
      root.setAttribute(MOTION_INTRO_DONE_ATTR, ""),
    );

    const io = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        io.unobserve(target);
        target.setAttribute(REVEALED_ATTR, "animate");
        settled([target]).then(() => target.setAttribute(REVEALED_ATTR, "done"));
      }
    });

    const watch = (el: Element) => {
      if (!el.hasAttribute(REVEALED_ATTR)) io.observe(el);
    };

    // Runs before the browser paints the new elements, so ones on screen never
    // show their hidden state.
    const adopt = (el: Element) => {
      if (el.hasAttribute(REVEALED_ATTR)) return;
      if (inViewport(el)) el.setAttribute(REVEALED_ATTR, "instant");
      else io.observe(el);
    };

    document.querySelectorAll(SELECTOR).forEach(watch);

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes") {
          if (record.target instanceof Element && record.target.hasAttribute(REVEAL_ATTR)) adopt(record.target);
          continue;
        }
        record.addedNodes.forEach((node) => targetsIn(node).forEach(adopt));
        record.removedNodes.forEach((node) => targetsIn(node).forEach((el) => io.unobserve(el)));
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: [REVEAL_ATTR] });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
