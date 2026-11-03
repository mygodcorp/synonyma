import { richness, type Page, type Relation } from "./data";
import { labels } from "./labels";

/** All synonyms of a page, Wiktionary first (curated), then reverse links, then thesaurus. Deduplicated. */
export function allSynonyms(p: Page): Relation[] {
  const seen = new Set<string>();
  const out: Relation[] = [];
  const add = (r: Relation) => {
    if (seen.has(r.w) || r.w === p.w) return;
    seen.add(r.w);
    out.push(r);
  };
  p.entries.forEach((e) => e.syn?.forEach(add));
  p.rs?.forEach((w) => add({ w, l: 1 }));
  p.th?.forEach((g) => g.w.forEach(add));
  return out;
}

export function allAntonyms(p: Page): Relation[] {
  const seen = new Set<string>();
  const out: Relation[] = [];
  p.entries.forEach((e) =>
    e.ant?.forEach((r) => {
      if (!seen.has(r.w)) {
        seen.add(r.w);
        out.push(r);
      }
    }),
  );
  p.ra?.forEach((w) => {
    if (!seen.has(w)) {
      seen.add(w);
      out.push({ w, l: 1 });
    }
  });
  return out;
}

/**
 * Synonyms for snippets (meta description, cards, OG): curated Wiktionary words without usage label first
 * (most common first), then reverse links, then the thesaurus in its own order, labelled words last.
 */
export function rankedSynonyms(p: Page): Relation[] {
  const seen = new Set<string>([p.w]);
  const out: Relation[] = [];
  const add = (r: Relation) => {
    if (!seen.has(r.w)) {
      seen.add(r.w);
      out.push(r);
    }
  };
  const plain = (r: Relation) => !labels(r.t).length;
  const wik = p.entries.flatMap((e) => e.syn ?? []);
  [...wik.filter(plain)].sort((a, b) => richness(b.w) - richness(a.w)).forEach(add);
  p.rs?.forEach((w) => add({ w, l: 1 }));
  p.th?.forEach((g) => g.w.filter(plain).forEach(add));
  allSynonyms(p).forEach(add);
  return out;
}

export function firstDefinition(p: Page): { pos: string; gloss: string } | null {
  for (const e of p.entries) if (e.senses[0]) return { pos: e.p, gloss: e.senses[0].g };
  return null;
}

export function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** ~150 characters: what the searcher wants (synonyms) first, then antonyms or the definition. */
export function metaDescription(p: Page, max = 140): string {
  const syn = rankedSynonyms(p).map((r) => r.w);
  const ant = allAntonyms(p).map((r) => r.w);
  const def = firstDefinition(p);
  let out = `Synonymes de ${p.w} : `;
  const parts: string[] = [];
  for (const w of syn) {
    if ((out + [...parts, w].join(", ")).length > max - 40) break;
    parts.push(w);
  }
  out += parts.join(", ") + (syn.length > parts.length ? "…" : ".");
  if (ant.length) {
    const a: string[] = [];
    for (const w of ant) {
      if ((out + " Antonymes : " + [...a, w].join(", ")).length > max - 1) break;
      a.push(w);
    }
    if (a.length) out += ` Antonymes : ${a.join(", ")}.`;
  } else if (def && out.length + def.gloss.length + 2 <= max) {
    out += ` ${def.gloss}`;
  }
  return out.length > max ? out.slice(0, max - 1) + "…" : out;
}
