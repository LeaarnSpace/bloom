import type { GeoPoint } from "./domain";

// Supported cities with a centre point. Listings use the centre until a map
// picker / geocoder is chosen.
export const CITIES: { name: string; centre: GeoPoint }[] = [
  { name: "Lagos", centre: { lat: 6.5244, lng: 3.3792 } },
  { name: "Abuja", centre: { lat: 9.0765, lng: 7.3986 } },
  { name: "Port Harcourt", centre: { lat: 4.8156, lng: 7.0498 } },
  { name: "Ibadan", centre: { lat: 7.3775, lng: 3.947 } },
  { name: "Kano", centre: { lat: 12.0022, lng: 8.592 } },
  { name: "Enugu", centre: { lat: 6.4584, lng: 7.5464 } },
  { name: "Benin City", centre: { lat: 6.335, lng: 5.6037 } },
];

export const CATEGORIES = ["Apartments", "Houses", "Short-let", "Commercial", "Venues", "Land"];
