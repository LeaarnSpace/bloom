import type { ComingSoonProps } from "@bloom/design-kit";
import { BrandLockup, FooterColumns, FooterTagline } from "../shared/Footer";
import { SignupForm } from "../shared/SignupForm";
import { DesignToggle } from "../shared/design-toggle";
import { Hero, SiteHeader } from "../shared/masthead";
import { reveal, Words } from "../shared/motion";
import { copyright, interestCategories, specialNeedsCategories } from "../shared/content";
import { CategoryCard } from "./CategoryCard";
import l from "../shared/layout.module.css";
import s from "./styles.module.css";

// Design B — "Clean". Figma node 1847:38920 (Bloom Homepage - Temp (Coming soon)).
// Built as drawn: category cards and footer links are plain text until their pages exist.
// Sections reveal on scroll (shared/motion): titles word by word, the rest rises in.

const specialNeeds = [
  specialNeedsCategories.physical,
  specialNeedsCategories.sensory,
  specialNeedsCategories.cognitive,
  specialNeedsCategories.seb,
];

export function ComingSoon({ signup, designSwitcher, contactEmail }: ComingSoonProps) {
  return (
    <div className={s.page}>
      <SiteHeader actions={designSwitcher && <DesignToggle switcher={designSwitcher} side="end" />} />

      <main>
        <Hero />

        <section className={s.categories}>
          <div className={l.container}>
            <h2 {...reveal("words", s.sectionTitle)}>
              <Words text="Find a programme by interest" />
            </h2>
            <div className={s.grid}>
              {interestCategories.map((c) => (
                <CategoryCard key={c.key} category={c} title={c.key === "stem" ? `${c.title} (STEM)` : c.title} />
              ))}
            </div>

            <div className={s.specialNeeds}>
              <div className={s.specialNeedsHead}>
                <h2 {...reveal("words", s.specialNeedsTitle)}>
                  <Words text="Special Needs Inclusion" />
                </h2>
                <p {...reveal("rise", s.specialNeedsText, 100)}>Programmes that welcome and support children with additional needs</p>
              </div>
              <div className={`${s.grid} ${s.specialNeedsGrid}`}>
                {specialNeeds.map((c) => (
                  <CategoryCard key={c.key} category={c} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={s.signup} id="signup">
          <div {...reveal("rise", `${l.container} ${s.signupInner}`)}>
            <p className={s.signupCopy}>
              Swimming in Gbagada, coding in Lekki, piano in Ojodu. Discover activities close to home, see what matters
              before you decide, and hear from other parents who&apos;ve been there.
            </p>
            <SignupForm
              signup={signup}
              placeholder="Enter your Email"
              buttonLabel="Stay in the loop"
              classes={{ form: s.form, input: s.input, button: s.button, confirmation: s.confirmation }}
            />
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footerRule} />
        <div {...reveal("rise", `${l.container} ${s.footerContent}`)}>
          <div className={s.footerBrand}>
            <BrandLockup classes={{ name: s.lockupName, endorsement: s.lockupEndorsement }} />
            <FooterTagline className={s.footerTagline} />
          </div>
          <FooterColumns
            classes={{ root: s.footerNav, column: s.footerColumn, heading: s.footerHeading, links: s.footerLinks }}
            contactEmail={contactEmail}
          />
        </div>
        <div className={`${l.container} ${s.footerDivider}`} />
        <p {...reveal("rise", `${l.container} ${s.copyright}`)}>{copyright()}</p>
      </footer>
    </div>
  );
}
