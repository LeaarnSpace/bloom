import type {
  FacetValue,
  GeoPoint,
  Listing,
  ListingInput,
  ListingQuery,
  ListingRepository,
  ListingSearch,
  SearchResult,
} from "@bloom/core";

type Filter = (listing: Listing) => boolean;

function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function buildFilters(q: ListingQuery): Record<string, Filter> {
  const filters: Record<string, Filter> = {};
  const text = q.text?.trim().toLowerCase();
  if (text) {
    filters.text = (l) => `${l.title} ${l.description} ${l.category} ${l.city}`.toLowerCase().includes(text);
  }
  if (q.city) filters.city = (l) => l.city === q.city;
  if (q.category) filters.category = (l) => l.category === q.category;
  if (q.priceMin !== undefined) filters.priceMin = (l) => (l.price?.amount ?? 0) >= q.priceMin!;
  if (q.priceMax !== undefined) filters.priceMax = (l) => (l.price?.amount ?? 0) <= q.priceMax!;
  if (q.near) {
    const { point, radiusKm } = q.near;
    filters.near = (l) => distanceKm(point, l.location) <= radiusKm;
  }
  return filters;
}

// Facet counts ignore the facet's own filter, so selecting a city still shows the other cities.
function facet(listings: Listing[], filters: Record<string, Filter>, field: "city" | "category"): FacetValue[] {
  const others = Object.entries(filters).filter(([key]) => key !== field).map(([, f]) => f);
  const counts = new Map<string, number>();
  for (const l of listings) {
    if (others.every((f) => f(l))) counts.set(l[field], (counts.get(l[field]) ?? 0) + 1);
  }
  return [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value));
}

function sorter(q: ListingQuery): ((a: Listing, b: Listing) => number) | undefined {
  switch (q.sort) {
    case "newest":
      return (a, b) => b.createdAt.localeCompare(a.createdAt);
    case "price_asc":
      return (a, b) => (a.price?.amount ?? 0) - (b.price?.amount ?? 0);
    case "price_desc":
      return (a, b) => (b.price?.amount ?? 0) - (a.price?.amount ?? 0);
    case "distance":
      if (!q.near) return undefined;
      return (a, b) => distanceKm(q.near!.point, a.location) - distanceKm(q.near!.point, b.location);
    default:
      return undefined;
  }
}

export function createMemoryListings(seed: Listing[]): ListingRepository & ListingSearch {
  const listings = [...seed];
  let nextId = listings.length + 1;

  function replace(id: string, change: (l: Listing) => Listing): Listing | null {
    const i = listings.findIndex((l) => l.id === id);
    if (i === -1) return null;
    listings[i] = change(listings[i]!);
    return listings[i]!;
  }

  return {
    async getById(id) {
      return listings.find((l) => l.id === id) ?? null;
    },

    async listByProvider(providerId) {
      return listings.filter((l) => l.providerId === providerId);
    },

    async listByStatus(status) {
      return listings.filter((l) => l.status === status).sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    },

    async create(providerId, input: ListingInput) {
      const now = new Date().toISOString();
      const listing: Listing = { ...input, id: `l${nextId++}`, providerId, status: "pending", createdAt: now, updatedAt: now };
      listings.push(listing);
      return listing;
    },

    async update(id, input) {
      return replace(id, (l) => ({
        ...l,
        ...input,
        status: "pending",
        reviewNote: undefined,
        updatedAt: new Date().toISOString(),
      }));
    },

    async review(id, { status, note }) {
      return replace(id, (l) => ({ ...l, status, reviewNote: note }));
    },

    async search(q): Promise<SearchResult<Listing>> {
      const filters = buildFilters(q);
      const approved = listings.filter((l) => l.status === "approved");
      const matches = approved.filter((l) => Object.values(filters).every((f) => f(l)));
      const compare = sorter(q);
      if (compare) matches.sort(compare);

      const page = Math.max(1, q.page ?? 1);
      const pageSize = q.pageSize ?? 20;
      return {
        items: matches.slice((page - 1) * pageSize, page * pageSize),
        total: matches.length,
        page,
        pageSize,
        facets: {
          city: facet(approved, filters, "city"),
          category: facet(approved, filters, "category"),
        },
      };
    },
  };
}
