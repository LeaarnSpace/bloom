import type { CategoryCopy } from "../shared/content";
import { ComingSoonOverlay } from "../shared/ComingSoonOverlay";
import { reveal } from "../shared/motion";
import s from "./styles.module.css";

// Figma: "Programme category" card (292 x 198). Hover shows "Coming soon" (variant "Variant2"). "Explore →" is plain text until category pages exist.
export function CategoryCard({ category, title = category.title }: { category: CategoryCopy; title?: string }) {
  return (
    <article {...reveal("rise", s.card)}>
      <span className={s.accent} />
      <div className={s.cardCopy}>
        <h3 className={s.cardTitle}>{title}</h3>
        <p className={s.cardText}>{category.examples}</p>
      </div>
      <p className={s.explore}>{"Explore  →"}</p>
      <ComingSoonOverlay backdropClassName={s.comingSoonBackdrop} />
    </article>
  );
}
