import { sitemapIndexXml } from "@/lib/sitemaps";

export const dynamic = "force-static";

/** Sitemap index: the single URL to submit to Search Console. */
export function GET() {
  return new Response(sitemapIndexXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
