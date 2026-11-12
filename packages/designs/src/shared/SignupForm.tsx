import { SIGNUP_CONFIRMATION, type ComingSoonProps } from "@bloom/design-kit";
import s from "./signup.module.css";

export interface SignupFormClasses {
  form?: string;
  input?: string;
  button?: string;
  confirmation?: string;
}

interface SignupFormProps {
  signup: ComingSoonProps["signup"];
  classes: SignupFormClasses;
  placeholder: string;
  buttonLabel: string;
}

// The waitlist form every design uses; designs only supply the look and wording.
// Works without JavaScript (plain form post). The browser checks the email format.
export function SignupForm({ signup, classes, placeholder, buttonLabel }: SignupFormProps) {
  if (signup.joined) {
    return (
      <p className={classes.confirmation} role="status">
        {SIGNUP_CONFIRMATION}
      </p>
    );
  }
  return (
    <form className={classes.form} action={signup.action}>
      {/* The placeholder is not a label: this names the field for screen readers. */}
      <label htmlFor="signup-email" className={s.visuallyHidden}>
        Email address
      </label>
      <input
        id="signup-email"
        className={classes.input}
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder={placeholder}
      />
      {/* Honeypot: hidden from people and screen readers; bots that fill it are ignored. */}
      <div className={s.visuallyHidden} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <button className={classes.button} type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}
