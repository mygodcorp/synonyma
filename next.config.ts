import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The dictionary lives in data/ and is read with fs at request time:
  // make sure every serverless function that needs it ships with it.
  // (Route keys are globs, so "[word]" would be read as a character class: use a catch-all.)
  outputFileTracingIncludes: {
    "/**": ["./data/**/*"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
