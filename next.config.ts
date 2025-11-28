import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'y-protocols/awareness': require.resolve('y-protocols/dist/awareness.cjs'),
    };
    return config;
  },
};

export default nextConfig;
