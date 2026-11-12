import { footerColumns, footerTagline, type FooterLink } from "./content";
import s from "./footer.module.css";

// Structure shared by every design's footer; designs only supply class names.

export interface LockupClasses {
  root?: string;
  name?: string;
  endorsement?: string;
}

// "Bloom / BY LEARNSPACE" (Figma component "Lockup / Bloom by Learnspace", icon off).
export function BrandLockup({ classes }: { classes: LockupClasses }) {
  return (
    <div className={classes.root}>
      <p className={classes.name}>Bloom</p>
      <p className={classes.endorsement}>BY LEARNSPACE</p>
    </div>
  );
}

export function FooterTagline({ className }: { className?: string }) {
  return (
    <p className={className}>
      {footerTagline[0]}
      <br />
      {footerTagline[1]}
    </p>
  );
}

export interface FooterColumnsClasses {
  root?: string;
  column?: string;
  heading?: string;
  links?: string;
}

function hrefFor(link: FooterLink, contactEmail?: string): string | undefined {
  return link.to === "contact" && contactEmail ? `mailto:${contactEmail}` : undefined;
}

// Links without a destination yet are plain text.
export function FooterColumns({ classes, contactEmail }: { classes: FooterColumnsClasses; contactEmail?: string }) {
  return (
    <div className={classes.root}>
      {footerColumns.map((col) => (
        <div key={col.heading} className={classes.column}>
          <p className={classes.heading}>{col.heading}</p>
          <ul className={classes.links}>
            {col.links.map((link) => {
              const href = hrefFor(link, contactEmail);
              return (
                <li key={link.label}>
                  {href ? (
                    <a href={href} className={s.link}>
                      {link.label}
                    </a>
                  ) : (
                    link.label
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
