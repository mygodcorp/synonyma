import { ogCard } from "@/lib/og";
import { getPage } from "@/lib/data";
import { rankedSynonyms } from "@/lib/summary";

export { size, contentType } from "@/lib/og";
export const alt = "Synonymes";

export default async function Image({ params }: { params: Promise<{ word: string }> }) {
  let word = (await params).word;
  try {
    word = decodeURIComponent(word);
  } catch {}
  const page = getPage(word);
  const syn = page ? rankedSynonyms(page).slice(0, 5).map((r) => r.w) : [];
  return ogCard(page?.w ?? "Synonyma", "Synonymes de", syn.length ? syn.join(" · ") : "Dictionnaire des synonymes");
}
