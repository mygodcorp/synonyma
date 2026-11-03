import type { MetadataRoute } from "next";
import { getIndex, wordHref } from "@/lib/data";
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
    return [
      { url: SITE.url, changeFrequency: "daily", priority: 1 },
      { url: `${SITE.url}/dictionnaire`, changeFrequency: "monthly", priority: 0.6 },
      ...Array.from("abcdefghijklmnopqrstuvwxyz", (l) => ({ url: `${SITE.url}/dictionnaire/${l}`, priority: 0.4 })),
      { url: `${SITE.url}/cgu`, priority: 0.1 },
    ];
  }
  return getIndex()
    .slice((id - 1) * CHUNK, id * CHUNK)
    .map(([w]) => ({ url: SITE.url + wordHref(w) }));
}
