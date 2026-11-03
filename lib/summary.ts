import type { Page, Relation } from "./data";

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

export function firstDefinition(p: Page): { pos: string; gloss: string } | null {
  for (const e of p.entries) if (e.senses[0]) return { pos: e.p, gloss: e.senses[0].g };
  return null;
}

export function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function metaDescription(p: Page): string {
  const syn = allSynonyms(p).slice(0, 8).map((r) => r.w);
  const def = firstDefinition(p);
  const parts = [];
  if (syn.length) parts.push(`Synonymes de ${p.w} : ${syn.join(", ")}…`);
  const ant = allAntonyms(p).slice(0, 4).map((r) => r.w);
  if (ant.length) parts.push(`Antonymes : ${ant.join(", ")}.`);
  if (def) parts.push(`Définition : ${def.gloss}`);
  const s = parts.join(" ");
  return s.length > 300 ? s.slice(0, 297) + "…" : s;
}
