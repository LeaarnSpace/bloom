export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Money {
  amount: number;
  currency: "NGN";
}

export interface ProviderInput {
  name: string;
  description: string;
  city: string;
  phone?: string;
  // IANA zone (e.g. "Africa/Lagos"). Defines the provider's "day" for stats.
  timeZone: string;
}

export interface Provider extends ProviderInput {
  id: string;
  slug: string;
}

// Only "approved" listings are public. New listings and edits go back to "pending".
export type ListingStatus = "pending" | "approved" | "rejected";

export interface ListingInput {
  title: string;
  description: string;
  category: string;
  city: string;
  price?: Money;
  location: GeoPoint;
  imageUrl?: string;
}

export interface Listing extends ListingInput {
  id: string;
  providerId: string;
  status: ListingStatus;
  reviewNote?: string;
  // UTC instants (ISO 8601 with "Z").
  createdAt: string;
  updatedAt: string;
}

export interface ReviewDecision {
  status: "approved" | "rejected";
  note?: string;
}

export type ListingSort = "relevance" | "newest" | "price_asc" | "price_desc" | "distance";

export interface ListingQuery {
  text?: string;
  city?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  near?: { point: GeoPoint; radiusKm: number };
  sort?: ListingSort;
  page?: number;
  pageSize?: number;
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  facets: Record<string, FacetValue[]>;
}
