import { Fragment, type CSSProperties, type ReactNode } from "react";
import m from "./motion.module.css";

// One word of a heading that animates word by word. `index` sets its place in
// the stagger (50ms apart). Use inside an element given intro("words") or
// reveal("words").
export function Word({ index, children }: { index: number; children: ReactNode }) {
  return (
    <span className={m.word} style={{ "--i": index } as CSSProperties}>
      {children}
    </span>
  );
}

// Splits plain text into <Word>s, keeping the spaces between them so lines wrap
// exactly as the unsplit text would.
export function Words({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <Word index={i}>{word}</Word>
    </Fragment>
  ));
}
