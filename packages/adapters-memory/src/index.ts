import type { Services } from "@bloom/core";
import { consoleCodeSender, createMemoryAuth, type MemoryAuthOptions } from "./auth";
import { createMemoryAnalytics } from "./analytics";
import { createMemoryListings } from "./listings";
import { createMemoryProviders } from "./providers";
import { createMemoryWaitlist } from "./waitlist";
import { seedListings, seedProviders } from "./seed";

export { consoleCodeSender, createMemoryAuth } from "./auth";
export { createMemoryAnalytics } from "./analytics";
export { createMemoryListings } from "./listings";
export { createMemoryProviders } from "./providers";
export { createMemoryWaitlist } from "./waitlist";
export { seedListings, seedProviders } from "./seed";

export function createMemoryServices(auth: Partial<MemoryAuthOptions> = {}): Services {
  const listings = createMemoryListings(seedListings);
  const analytics = createMemoryAnalytics();
  return {
    auth: createMemoryAuth({ sender: consoleCodeSender, ...auth }),
    listings,
    listingSearch: listings,
    providers: createMemoryProviders(seedProviders),
    analytics,
    providerStats: analytics,
    waitlist: createMemoryWaitlist(),
  };
}
