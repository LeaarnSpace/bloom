import type { ReactNode } from "react";
import { routes } from "@bloom/design-kit";
import { HeroIllustration } from "../HeroIllustration";
import { heroLead } from "../content";
import { intro, Word } from "../motion";
import l from "../layout.module.css";
import s from "./masthead.module.css";

// The top of the page (header + hero), shared by every design so it stays in
// exactly the same place when visitors switch designs. Geometry follows design B
// (Figma 1847:38920). Colours come from the design: --ink, --muted, and
// --masthead-rule for the header's bottom border (none by default).
//
// Both play a short entrance on page load (shared/motion). Every design renders
// them as the first children of the page and of <main>, so React keeps them
// across a design switch and the entrance never replays.

export function SiteHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className={s.header}>
      <div className={`${l.container} ${s.headerInner}`}>
        <a href={routes.home()} {...intro("drop", s.logo, 40)}>
          Bloom
        </a>
        {actions && <div {...intro("drop", s.actions, 120)}>{actions}</div>}
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section>
      <div className={`${l.container} ${s.heroInner}`}>
        <div className={s.heroCopy}>
          <h1 {...intro("words", s.headline, 100)}>
            <Word index={0}>Find</Word> <Word index={1}>what</Word> <Word index={2}>helps</Word>{" "}
            <br className={s.headlineBreak} />
            <Word index={3}>your</Word> <Word index={4}>child</Word>{" "}
            <strong>
              <Word index={5}>bloom</Word>
            </strong>
          </h1>
          <p {...intro("rise", s.lead, 450)}>{heroLead}</p>
        </div>
        <HeroIllustration {...intro("settle", s.illustration)} />
      </div>
    </section>
  );
}
