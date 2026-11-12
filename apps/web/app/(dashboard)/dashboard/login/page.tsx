import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { errorMessage } from "../../_components/messages";
import s from "../../_components/dashboard.module.css";
import { requestCode, verifyCode } from "./actions";

type Params = Record<string, string | string[] | undefined>;

export default async function LoginPage({ searchParams }: { searchParams: Promise<Params> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  const params = await searchParams;
  const error = errorMessage(params.error);
  const codeStep = params.step === "code";

  return (
    <div className={`${s.panel} ${s.narrow}`}>
      <h1>Sign in</h1>
      {codeStep ? (
        <form action={verifyCode} className={s.form}>
          <p className={s.muted}>We sent a 6-digit code. It expires in 10 minutes.</p>
          {error && <p className={params.error === "wait" ? s.notice : s.error}>{error}</p>}
          <label className={s.field}>
            Code
            <input className={s.input} name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required autoFocus />
          </label>
          <button className={s.button}>Sign in</button>
          <a href="/dashboard/login" className={s.muted}>
            Use a different email or number
          </a>
        </form>
      ) : (
        <form action={requestCode} className={s.form}>
          <p className={s.muted}>List your properties and spaces on Bloom and see how they perform.</p>
          {error && <p className={s.error}>{error}</p>}
          <label className={s.field}>
            Email or phone number
            <input className={s.input} name="identifier" placeholder="you@example.com or 0803 000 0000" required autoFocus />
          </label>
          <button className={s.button}>Send code</button>
        </form>
      )}
    </div>
  );
}
