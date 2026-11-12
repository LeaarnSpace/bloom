import s from "./coming-soon-overlay.module.css";

// The "Coming soon" hover state for category cards (Figma: "Category" Variant4 in A,
// "Programme category" Variant2 in B; shapes from "Motion / Coming soon floating shapes").
// Place it as the card's last direct child; the card needs position: relative and
// overflow: hidden. It shows while the card is hovered. Each design passes its own
// backdrop class, which styles the dark layer and how it grows in (`:hover > *`).
export function ComingSoonOverlay({ backdropClassName }: { backdropClassName?: string }) {
  return (
    <span className={s.overlay} aria-hidden="true">
      <span className={backdropClassName ? `${s.backdrop} ${backdropClassName}` : s.backdrop} />
      <span className={s.content}>
        <span className={s.shapes}>
          <svg className={`${s.shape} ${s.circle}`} viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8" fill="#93B8E9" />
          </svg>
          <span className={`${s.shape} ${s.square}`} />
          <svg className={`${s.shape} ${s.triangle}`} viewBox="0 0 15.3535 15.354">
            <path
              d="M0.004 0.562C-0.04 0.214 0.281-0.07 0.621 0.015L14.974 3.604C15.368 3.702 15.487 4.204 15.179 4.468L8.913 9.838 2.62 15.233C2.317 15.492 1.848 15.311 1.798 14.915L0.004 0.562Z"
              fill="#FEF5E3"
            />
          </svg>
        </span>
        <span className={s.label}>Coming soon</span>
      </span>
    </span>
  );
}
