import type { ComponentProps } from "react";
import { illustrationMarkup } from "./illustration-markup";
import s from "./illustration.module.css";

// The animated hero artwork shared by every coming-soon design (418 x 275 in Figma).
// Decorative only. Animation stops when the visitor prefers reduced motion.
export function HeroIllustration({ className, ...rest }: Omit<ComponentProps<"div">, "children">) {
  return (
    <div
      className={className ? `${s.root} ${className}` : s.root}
      {...rest}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: illustrationMarkup }}
    />
  );
}
