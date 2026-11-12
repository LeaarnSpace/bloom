import { cache } from "react";
import { AUTO_DESIGN, resolveDesignId } from "@bloom/design-kit";
import { readDesignCookie } from "@bloom/design-kit/next";
import { defaultDesignId, designs, seasons } from "./registry";

// Cached per request so the layout and page resolve the same design once.
export const getActiveDesign = cache(async () => {
  const cookie = await readDesignCookie();
  const id = resolveDesignId({
    cookie,
    seasons,
    available: designs.map((d) => d.id),
    fallback: defaultDesignId,
  });
  const entry = designs.find((d) => d.id === id)!;
  return {
    id,
    selected: cookie === id ? id : AUTO_DESIGN,
    options: designs.map(({ id, label }) => ({ id, label })),
    ui: await entry.load(),
  };
});
