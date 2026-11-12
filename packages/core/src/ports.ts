import type { ProviderStatsSummary, TrackedEvent } from "./analytics";
import type { Identifier, Session, User } from "./auth";
import type {
  Listing,
  ListingInput,
  ListingQuery,
  ListingStatus,
  Provider,
  ProviderInput,
  ReviewDecision,
  SearchResult,
} from "./domain";
import type { LocalDateRange } from "./time";
import type { WaitlistSignup } from "./waitlist";

// Ports: every external service the app depends on is described here and
// implemented by an adapter package. Apps wire adapters in their services file,
// so swapping a vendor (search engine, database, map/geocoding provider, chat
// backend...) never touches pages or designs.

// Returns listings in any status; callers decide what is public.
export interface ListingRepository {
  getById(id: string): Promise<Listing | null>;
  listByProvider(providerId: string): Promise<Listing[]>;
  listByStatus(status: ListingStatus): Promise<Listing[]>;
  create(providerId: string, input: ListingInput): Promise<Listing>;
  // Edits send the listing back to "pending" for review.
  update(id: string, input: ListingInput): Promise<Listing | null>;
  review(id: string, decision: ReviewDecision): Promise<Listing | null>;
}

// Only ever returns approved listings.
export interface ListingSearch {
  search(query: ListingQuery): Promise<SearchResult<Listing>>;
}

export interface ProviderRepository {
  getById(id: string): Promise<Provider | null>;
  getBySlug(slug: string): Promise<Provider | null>;
  create(input: ProviderInput): Promise<Provider>;
}

// Delivers one-time codes. Separate from auth so SMS (e.g. Termii) and email
// (e.g. Resend) providers can be swapped independently.
export interface CodeSender {
  send(to: Identifier, code: string): Promise<void>;
}

export type RequestCodeResult = { ok: true } | { ok: false; reason: "rate_limited" };

// Passwordless sign-in with a one-time code sent by email or SMS.
// First successful sign-in with a new identifier creates the user.
export interface AuthService {
  requestCode(to: Identifier): Promise<RequestCodeResult>;
  verifyCode(to: Identifier, code: string): Promise<Session | null>;
  getUser(sessionToken: string): Promise<User | null>;
  signOut(sessionToken: string): Promise<void>;
  linkProvider(userId: string, providerId: string): Promise<void>;
}

// Write side of analytics. A production setup might fan out to our own event
// store (for provider stats) and a product-analytics tool (for our own funnels).
export interface AnalyticsSink {
  record(events: TrackedEvent[]): Promise<void>;
}

// Read side: the numbers we show providers. Must come from data we own.
// Days are bucketed in range.timeZone, never the server's zone.
export interface ProviderStats {
  summary(providerId: string, range: LocalDateRange): Promise<ProviderStatsSummary>;
}

// Adding an email that is already on the list is not an error and must not be
// distinguishable from a new sign-up (never reveal who is on the list).
export interface WaitlistRepository {
  add(signup: WaitlistSignup): Promise<void>;
}

export interface Services {
  auth: AuthService;
  listings: ListingRepository;
  listingSearch: ListingSearch;
  providers: ProviderRepository;
  analytics: AnalyticsSink;
  providerStats: ProviderStats;
  waitlist: WaitlistRepository;
}
