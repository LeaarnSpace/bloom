import s from "./styles.module.css";

// Inline SVGs exported from Figma (Arrow up-right 30px, icon/info 20px).

export function ArrowUpRight() {
  return (
    <svg className={s.arrow} viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path
        d="M8.75 21.25L21.25 8.75M21.25 21.25V8.75H8.75"
        stroke="#1E1E1E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg className={s.infoIcon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M18.25 10C18.25 14.5563 14.5563 18.25 10 18.25C5.44365 18.25 1.75 14.5563 1.75 10C1.75 5.44365 5.44365 1.75 10 1.75C14.5563 1.75 18.25 5.44365 18.25 10Z"
        stroke="#0E1B34"
        strokeWidth="1.5"
      />
      <path d="M10 9V14M10 6V6.5" stroke="#0E1B34" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
