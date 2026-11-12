import type { ComingSoonProps } from "@bloom/design-kit";
import { BrandLockup, FooterColumns, FooterTagline } from "../shared/Footer";
import { SignupForm } from "../shared/SignupForm";
import { DesignToggle } from "../shared/design-toggle";
import { Hero, SiteHeader } from "../shared/masthead";
import { reveal, Words } from "../shared/motion";
import { copyright, interestCategories, specialNeedsCategories, type CategoryCopy } from "../shared/content";
import atom from "./icons/atom.png";
import book from "./icons/book.png";
import brain from "./icons/brain.png";
import dumbbell from "./icons/dumbbell.png";
import eye from "./icons/eye.png";
import faces from "./icons/faces.png";
import globe from "./icons/globe.png";
import lotus from "./icons/lotus.png";
import toolbox from "./icons/toolbox.png";
import wheelchair from "./icons/wheelchair.png";
import { CategoryCard, type CardIcon } from "./CategoryCard";
import { InfoIcon } from "./icons";
import l from "../shared/layout.module.css";
import s from "./styles.module.css";

// Design A — "Warm". Figma node 1847:39911 (Parent · Homepage — Special needs, Desktop 1440).
// Header and hero are shared (shared/masthead) so they sit exactly where design B has them.
// Built as drawn, including Figma's quirks: cards 1–2 have larger titles, and
// "Creative & Expressive Arts" reuses the dumbbell icon. Cards and footer links
// are plain text until their pages exist.
// Sections reveal on scroll (shared/motion): titles word by word, the rest rises in.

const interestIcons: Record<string, CardIcon> = {
  physical: dumbbell,
  creative: dumbbell,
  cognitive: book,
  stem: atom,
  "life-skills": toolbox,
  "social-emotional": faces,
  spiritual: lotus,
  "socio-cultural": globe,
};

// Figma order differs from design B here (Cognitive before Sensory).
const specialNeeds: [CategoryCopy, CardIcon][] = [
  [specialNeedsCategories.physical, wheelchair],
  [specialNeedsCategories.cognitive, brain],
  [specialNeedsCategories.sensory, eye],
  [specialNeedsCategories.seb, faces],
];

export function ComingSoon({ signup, designSwitcher, contactEmail }: ComingSoonProps) {
  return (
    <div className={s.page}>
      <SiteHeader actions={designSwitcher && <DesignToggle switcher={designSwitcher} side="start" />} />
      <main>
        {/* Hero first inside <main>, as in design B, so React keeps it across a switch. */}
        <Hero />

        <div className={`${l.container} ${s.main}`}>
          <section className={s.interests}>
            <div className={s.sectionHead}>
              <p {...reveal("rise", s.overline)}>EXPLORE BY INTEREST</p>
              <h2 {...reveal("words", s.sectionTitle)}>
                <Words text="Find a programme by interest" />
              </h2>
              <p {...reveal("rise", s.sectionIntro, 100)}>
                Start with what they love. You can check the environment and support details on each programme.
              </p>
            </div>
            <div className={s.grid}>
              {interestCategories.map((c, i) => (
                <CategoryCard key={c.key} category={c} icon={interestIcons[c.key]!} large={i < 2} />
              ))}
            </div>
          </section>

          <section className={s.panel}>
            <div className={s.sectionHead}>
              <p {...reveal("rise", s.overline)}>SPECIAL NEEDS INCLUSION</p>
              <h2 {...reveal("words", s.sectionTitle)}>
                <Words text="Programmes that welcome and support every child" />
              </h2>
              <p {...reveal("rise", `${s.sectionIntro} ${s.ink}`, 100)}>
                Browse by the kind of support your child may need. Providers share the details so you can decide what
                fits.
              </p>
            </div>
            <div className={`${s.grid} ${s.needs}`}>
              {specialNeeds.map(([c, icon]) => (
                <CategoryCard key={c.key} category={c} icon={icon} tall />
              ))}
            </div>
            <div {...reveal("rise", s.note)}>
              <InfoIcon />
              <p>
                Support information is shared by providers. Contact them to discuss your child’s individual needs before
                booking.
              </p>
            </div>
          </section>

          <section {...reveal("rise", s.signup)} id="signup">
            <div className={s.signupText}>
              <h2 className={s.signupTitle}>Stay in the loop</h2>
              <p className={s.signupIntro}>New inclusive programmes and guides for parents, in your inbox. No spam.</p>
            </div>
            <SignupForm
              signup={signup}
              placeholder="Enter your email"
              buttonLabel="Subscribe"
              classes={{ form: s.form, input: s.input, button: s.button, confirmation: s.confirmation }}
            />
          </section>
        </div>
      </main>

      <footer className={s.footer}>
        <div {...reveal("rise", s.footerTop)}>
          <div className={s.footerBrand}>
            <BrandLockup classes={{ name: s.lockupName, endorsement: s.lockupEndorsement }} />
            <FooterTagline className={s.footerTagline} />
          </div>
          <FooterColumns
            classes={{ root: s.footerNav, column: s.footerColumn, heading: s.footerHeading, links: s.footerLinks }}
            contactEmail={contactEmail}
          />
        </div>
        <div className={s.footerRule} />
        <p {...reveal("rise", s.copyright)}>{copyright()}</p>
      </footer>
    </div>
  );
}
