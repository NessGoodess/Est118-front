import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "api.est118.test",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "api.est118.edu.mx",
      },
    ],
  },
};

export default nextConfig;
