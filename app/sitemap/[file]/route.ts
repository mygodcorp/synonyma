import { sitemapCount, sitemapXml } from "@/lib/sitemaps";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: sitemapCount() }, (_, i) => ({ file: `${i}.xml` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const m = /^(\d+)\.xml$/.exec((await params).file);
  const xml = m ? sitemapXml(Number(m[1])) : null;
  if (!xml) return new Response("Not found", { status: 404 });
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
