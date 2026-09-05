import type { NextConfig } from "next";

/**
 * Hosts allowed for next/image (optimized).
 * Content-block images with arbitrary URLs use <img> instead — do not whitelist the open web here.
 */
function apiRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "https",
      hostname: "img.youtube.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/**",
    },
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  if (apiUrl) {
    try {
      const u = new URL(apiUrl);
      patterns.push({
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: "/**",
      });
    } catch {
      // ignore invalid API URL
    }
  }

  // Local
  patterns.push({
    protocol: "http",
    hostname: "127.0.0.1",
    port: "8000",
    pathname: "/**",
  });
  patterns.push({
    protocol: "http",
    hostname: "localhost",
    port: "8000",
    pathname: "/**",
  });

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: apiRemotePatterns(),
  },
};

export default nextConfig;
