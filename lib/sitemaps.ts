import { DATA_STATS, RESERVED, getIndex, wordHref } from "./data";
import { SITE } from "./site";

// 50 000 URLs max per sitemap file: split the dictionary into chunks.
export const CHUNK = 40_000;

export function sitemapCount(): number {
  return Math.ceil(getIndex().length / CHUNK) + 1;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");

export function sitemapIndexXml(): string {
  const items = Array.from(
    { length: sitemapCount() },
    (_, i) => `<sitemap><loc>${SITE.url}/sitemap/${i}.xml</loc><lastmod>${DATA_STATS.builtAt}</lastmod></sitemap>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join("\n")}\n</sitemapindex>\n`;
}

/** Sitemap n: 0 = static pages, 1..N = word pages in index order. Null when out of range. */
export function sitemapXml(n: number): string | null {
  if (!Number.isInteger(n) || n < 0 || n >= sitemapCount()) return null;
  const lastmod = DATA_STATS.builtAt;
  const paths =
    n === 0
      ? ["", "/dictionnaire", ...Array.from("abcdefghijklmnopqrstuvwxyz", (l) => `/dictionnaire/${l}`), "/a-propos", "/cgu"]
      : getIndex()
          .slice((n - 1) * CHUNK, n * CHUNK)
          .filter(([w]) => !RESERVED.has(w))
          .map(([w]) => wordHref(w));
  const urls = paths.map((p) => `<url><loc>${esc(SITE.url + p)}</loc><lastmod>${lastmod}</lastmod></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
