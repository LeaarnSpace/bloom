export const routes = {
  home: () => "/",
  listing: (id: string) => `/listings/${encodeURIComponent(id)}`,
  provider: (slug: string) => `/providers/${encodeURIComponent(slug)}`,
};
