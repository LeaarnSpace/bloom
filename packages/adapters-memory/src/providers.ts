import type { Provider, ProviderRepository } from "@bloom/core";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "provider";
}

export function createMemoryProviders(seed: Provider[]): ProviderRepository {
  const providers = [...seed];
  let nextId = providers.length + 1;

  return {
    async getById(id) {
      return providers.find((p) => p.id === id) ?? null;
    },
    async getBySlug(slug) {
      return providers.find((p) => p.slug === slug) ?? null;
    },
    async create(input) {
      const base = slugify(input.name);
      let slug = base;
      for (let n = 2; providers.some((p) => p.slug === slug); n++) slug = `${base}-${n}`;
      const provider: Provider = { ...input, id: `p${nextId++}`, slug };
      providers.push(provider);
      return provider;
    },
  };
}
