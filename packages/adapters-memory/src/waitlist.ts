import type { WaitlistRepository, WaitlistSignup } from "@bloom/core";

export function createMemoryWaitlist(): WaitlistRepository & { all(): WaitlistSignup[] } {
  const byEmail = new Map<string, WaitlistSignup>();
  return {
    async add(signup) {
      // Keep the first sign-up; a repeat is silently accepted.
      if (!byEmail.has(signup.email)) byEmail.set(signup.email, signup);
    },
    all: () => [...byEmail.values()],
  };
}
