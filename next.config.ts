import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },

  async headers() {
    return [
      // Security header needed for Firebase Google popup auth
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
      // Immutable cache for hashed Next.js static assets
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Public API: campaign status (30s fresh, 2min stale-while-revalidate)
      {
        source: "/api/campaign",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=30, stale-while-revalidate=120",
          },
        ],
      },
      // Public API: stats (60s fresh, 5min stale-while-revalidate)
      {
        source: "/api/stats",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      // Public API: ideas listing
      {
        source: "/api/ideas",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=30, stale-while-revalidate=120",
          },
        ],
      },
      // Public API: settings (5min fresh — changes rarely)
      {
        source: "/api/settings",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      // SVG, fonts, icons — long cache
      {
        source: "/icon.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
