import type { MetadataRoute } from "next";
import { DATA_STATS, RESERVED, getIndex, wordHref } from "@/lib/data";
import { SITE } from "@/lib/site";

// 50 000 URLs max per sitemap file: split the dictionary into chunks.
const CHUNK = 40_000;

export async function generateSitemaps() {
  const n = Math.ceil(getIndex().length / CHUNK);
  return Array.from({ length: n + 1 }, (_, id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<number | string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  if (id === 0) {
    const lastModified = DATA_STATS.builtAt;
    return [
      { url: SITE.url, lastModified, changeFrequency: "daily", priority: 1 },
      { url: `${SITE.url}/dictionnaire`, lastModified, changeFrequency: "monthly", priority: 0.6 },
      ...Array.from("abcdefghijklmnopqrstuvwxyz", (l) => ({ url: `${SITE.url}/dictionnaire/${l}`, lastModified, priority: 0.4 })),
      { url: `${SITE.url}/a-propos`, lastModified, priority: 0.2 },
      { url: `${SITE.url}/cgu`, lastModified, priority: 0.1 },
    ];
  }
  return getIndex()
    .slice((id - 1) * CHUNK, id * CHUNK)
    .filter(([w]) => !RESERVED.has(w))
    .map(([w]) => ({ url: SITE.url + wordHref(w), lastModified: DATA_STATS.builtAt }));
}
