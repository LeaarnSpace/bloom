import type { CategoryCopy } from "../shared/content";
import { ComingSoonOverlay } from "../shared/ComingSoonOverlay";
import { reveal } from "../shared/motion";
import { ArrowUpRight } from "./icons";
import s from "./styles.module.css";

export type CardIcon = { src: string };

// Figma: "Category" component (310 x 250; 300 tall in the special-needs panel).
// Hover shows "Coming soon" (Figma variant "Variant4").
// `large` reproduces Figma's 26px titles on the first two interest cards.
export function CategoryCard({
  category,
  icon,
  large,
  tall,
}: {
  category: CategoryCopy;
  icon: CardIcon;
  large?: boolean;
  tall?: boolean;
}) {
  return (
    <article {...reveal("rise", tall ? `${s.card} ${s.cardTall}` : s.card)}>
      <span className={s.arrowPill}>
        <ArrowUpRight />
      </span>
      <div className={s.cardCopy}>
        <h3 className={large ? `${s.cardTitle} ${s.cardTitleLarge}` : s.cardTitle}>{category.title}</h3>
        <p className={s.cardText}>{category.examples}</p>
      </div>
      <div className={s.cardFoot}>
        <img className={s.cardIcon} src={icon.src} width={50} height={50} alt="" />
      </div>
      <ComingSoonOverlay backdropClassName={s.comingSoonBackdrop} />
    </article>
  );
}
