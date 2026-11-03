import type { MetadataRoute } from "next";
import { getIndex } from "@/lib/data";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const n = Math.ceil(getIndex().length / 40_000);
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/hasard"] }],
    sitemap: Array.from({ length: n + 1 }, (_, i) => `${SITE.url}/sitemap/${i}.xml`),
  };
}
