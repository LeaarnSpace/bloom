import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "./dashboard/actions";
import s from "./_components/dashboard.module.css";

export const metadata: Metadata = {
  title: "Bloom for providers",
};

// The dashboard has one fixed design; it does not use the switchable site designs.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className={s.body}>
        <header className={s.topbar}>
          <a href="/dashboard" className={s.brand}>
            bloom <span>for providers</span>
          </a>
          {user && (
            <nav className={s.nav}>
              <a href="/dashboard">Overview</a>
              {user.providerId && <a href="/dashboard/listings/new">New listing</a>}
              {user.role === "admin" && <a href="/dashboard/review">Review queue</a>}
              <span className={s.muted}>{user.email ?? user.phone}</span>
              <form action={signOut}>
                <button className={s.linkButton}>Sign out</button>
              </form>
            </nav>
          )}
        </header>
        <main className={s.main}>{children}</main>
      </body>
    </html>
  );
}
