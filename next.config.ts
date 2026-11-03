import type { NextConfig } from "next";

// Only the production deployment may be indexed: previews and *.vercel.app copies are duplicates.
const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The dictionary lives in data/ and is read with fs at request time:
  // make sure every serverless function that needs it ships with it.
  // (Route keys are globs, so "[word]" would be read as a character class: use a catch-all.)
  outputFileTracingIncludes: {
    "/**": ["./data/**/*"],
  },
  async rewrites() {
    return {
      // Markdown representations for LLM crawlers and agents: /manger.md, or Accept: text/markdown.
      beforeFiles: [
        { source: "/:word([^/]+)\\.md", destination: "/api/md/:word" },
        {
          source: "/",
          has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          destination: "/llms.txt",
        },
        {
          source: "/:word((?!api|dictionnaire|cgu|a-propos|hasard|llms\\.txt|_next)[^/.]+)",
          has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          destination: "/api/md/:word",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
    ];
    if (!isProd) base.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    return [
      { source: "/:path*", headers: base },
      { source: "/llms.txt", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
