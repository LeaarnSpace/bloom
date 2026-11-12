import { cookies } from "next/headers";
import { isEventName, type ClientEvent, type Services, type TrackedEvent } from "@bloom/core";

const VISITOR_COOKIE = "bloom-vid";
const MAX_EVENTS = 50;
const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp/i;

function parse(raw: string): ClientEvent[] {
  try {
    const body = JSON.parse(raw) as { events?: unknown };
    if (!Array.isArray(body.events)) return [];
    return body.events.slice(0, MAX_EVENTS).filter(
      (e): e is ClientEvent =>
        typeof e === "object" &&
        e !== null &&
        isEventName(e.name) &&
        (e.listingId === undefined || typeof e.listingId === "string") &&
        (e.providerId === undefined || typeof e.providerId === "string"),
    );
  } catch {
    return [];
  }
}

// Anonymous random id so we can count unique visitors. It is pseudonymous
// personal data under the NDPA, so it must be covered by the privacy policy.
async function visitorId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  jar.set(VISITOR_COOKIE, id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN || undefined,
  });
  return id;
}

// Owner is always looked up server-side so a client can't inflate another provider's stats.
async function enrich(services: Services, events: ClientEvent[], visitor: string): Promise<TrackedEvent[]> {
  const at = new Date().toISOString();
  const tracked = await Promise.all(
    events.map(async (e): Promise<TrackedEvent | null> => {
      if (e.listingId) {
        const listing = await services.listings.getById(e.listingId);
        return listing && { name: e.name, listingId: listing.id, providerId: listing.providerId, visitorId: visitor, at };
      }
      if (e.providerId) {
        const provider = await services.providers.getById(e.providerId);
        return provider && { name: e.name, providerId: provider.id, visitorId: visitor, at };
      }
      return null;
    }),
  );
  return tracked.filter((e) => e !== null);
}

export interface EventsHandlerOptions {
  // Provider the signed-in visitor manages, if any; their own activity is not counted.
  currentProviderId?: () => Promise<string | undefined>;
}

export function createEventsHandler(services: Services, { currentProviderId }: EventsHandlerOptions = {}) {
  return async function POST(request: Request): Promise<Response> {
    if (BOT_UA.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });
    const events = parse(await request.text());
    if (events.length > 0) {
      const [tracked, ownProvider] = await Promise.all([
        enrich(services, events, await visitorId()),
        currentProviderId?.(),
      ]);
      await services.analytics.record(tracked.filter((e) => e.providerId !== ownProvider));
    }
    return new Response(null, { status: 204 });
  };
}
