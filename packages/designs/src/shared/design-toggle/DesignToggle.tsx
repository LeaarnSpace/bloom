"use client";

import { useRef, useState, type MouseEvent } from "react";
import type { DesignSwitcherProps } from "@bloom/design-kit";
import { SquintGrinFace, WideEyesFace } from "./faces";
import s from "./design-toggle.module.css";

// "start": butter track, knob left, wide eyes. "end": blue-grey track, knob right, grin.
export type ToggleSide = "start" | "end";

export interface DesignToggleProps {
  switcher: Pick<DesignSwitcherProps, "options" | "activeId" | "action">;
  // Where this design shows the knob. It moves to the other side while switching.
  side: ToggleSide;
  className?: string;
}

// Must match --toggle-ms in design-toggle.module.css.
const SWITCH_MS = 350;

const opposite = (side: ToggleSide): ToggleSide => (side === "start" ? "end" : "start");

// Switches to the next design. Without JS it is a plain form post to the
// design action; with JS the knob slides across first, then the form submits.
//
// Every design renders this toggle in the same spot, so React keeps this one
// instance (and its state) across a design switch. "Switching" is therefore
// derived from the design we asked for, not stored as a flag: it ends by itself
// once the page arrives in that design, ready for the next click.
export function DesignToggle({ switcher: { options, activeId, action }, side, className }: DesignToggleProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const switching = requestedId !== null && requestedId !== activeId;

  const index = options.findIndex((o) => o.id === activeId);
  const next = options[(index + 1) % options.length];
  if (!next || next.id === activeId) return null;

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (switching || !next) return;
    setRequestedId(next.id);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => formRef.current?.requestSubmit(), reduced ? 0 : SWITCH_MS);
  }

  const label = `Switch to the ${next.label} design`;

  return (
    <form ref={formRef} action={action} className={s.form}>
      <input type="hidden" name="design" value={next.id} />
      <button
        type="submit"
        className={className ? `${s.button} ${className}` : s.button}
        data-side={switching ? opposite(side) : side}
        aria-label={label}
        title={label}
        aria-busy={switching || undefined}
        onClick={onClick}
      >
        <span className={s.knob}>
          <WideEyesFace className={`${s.face} ${s.faceStart}`} />
          <SquintGrinFace className={`${s.face} ${s.faceEnd}`} />
        </span>
      </button>
    </form>
  );
}
