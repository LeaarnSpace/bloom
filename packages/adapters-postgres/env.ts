// Database settings for tooling that runs outside Next.js (migrations,
// drizzle-kit), which is what normally loads apps/web/.env.local.

// Loads apps/web/.env.local like Next.js does: variables already set in the
// environment win, and a missing file is fine (e.g. on Vercel).
export function loadLocalEnv(): void {
  try {
    process.loadEnvFile(new URL("../../apps/web/.env.local", import.meta.url));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

// The URL to run migrations with: DATABASE_DIRECT_URL, or undefined when no
// database is configured. Migrations need a direct connection: Neon's pooler
// runs PgBouncer in transaction mode, which doesn't suit schema changes. The app
// itself uses DATABASE_POOLED_URL.
export function migrationUrl(): string | undefined {
  const direct = process.env.DATABASE_DIRECT_URL;
  if (direct) {
    if (new URL(direct).hostname.includes("-pooler.")) {
      throw new Error('DATABASE_DIRECT_URL is a Neon pooled URL (host contains "-pooler"). Use the direct URL.');
    }
    return direct;
  }
  // The app has a database but it couldn't be migrated: fail rather than ship that.
  if (process.env.DATABASE_POOLED_URL) {
    throw new Error("DATABASE_POOLED_URL is set but DATABASE_DIRECT_URL isn't. Migrations need the direct URL.");
  }
  return undefined;
}
