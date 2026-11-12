import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@bloom/core", "@bloom/adapters-memory", "@bloom/design-kit", "@bloom/designs", "@bloom/tracking"],
};

export default config;
