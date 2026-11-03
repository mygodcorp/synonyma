import { DATA_STATS, formatNumber, type Page, type Relation } from "./data";
import { labels } from "./labels";
import { SITE } from "./site";
import { allAntonyms, allSynonyms } from "./summary";

const url = (w: string) => `${SITE.url}/${encodeURIComponent(w)}`;
const rel = (r: Relation) => {
  const l = labels(r.t);
  return (r.l ? `[${r.w}](${url(r.w)})` : r.w) + (l.length ? ` (${l.join(", ")})` : "");
};

/** Markdown version of a word page, for LLM crawlers and agents (served at /<mot>.md). */
export function pageToMarkdown(p: Page): string {
  const out: string[] = [];
  const syn = allSynonyms(p);
  const ant = allAntonyms(p);
  out.push(`# Synonymes de ${p.w}`, "");
  out.push(`Source : ${url(p.w)} · ${syn.length} synonymes · ${ant.length} antonymes · mis à jour le ${DATA_STATS.builtAt}`, "");

  if (syn.length) {
    out.push(`## Synonymes de ${p.w}`, "");
    for (const e of p.entries) {
      if (!e.syn?.length) continue;
      out.push(`### ${e.p}`, "");
      const groups = new Map<string, Relation[]>();
      for (const r of e.syn) {
        const k = r.s && !/^[\s()\d.,-]*$/.test(r.s) ? r.s : "";
        groups.set(k, [...(groups.get(k) ?? []), r]);
      }
      for (const [sense, rs] of groups) out.push(`- ${sense ? `*${sense}* : ` : ""}${rs.map(rel).join(", ")}`);
      out.push("");
    }
    if (p.rs?.length) out.push("### Mots apparentés", "", `- ${p.rs.map((w) => rel({ w, l: 1 })).join(", ")}`, "");
    if (p.th?.length) {
      out.push("### Thésaurus", "");
      p.th.forEach((g, i) => out.push(`- Sens ${i + 1}${g.p ? ` (${g.p})` : ""} : ${g.w.map(rel).join(", ")}`));
      out.push("");
    }
  }

  if (ant.length) out.push(`## Antonymes de ${p.w}`, "", ant.map(rel).join(", "), "");

  if (p.entries.some((e) => e.senses.length)) {
    out.push("## Définitions", "");
    for (const e of p.entries) {
      out.push(`### ${e.p}${e.ipa ? ` ${e.ipa}` : ""}`, "");
      e.senses.forEach((s, i) => {
        const l = labels(s.t);
        out.push(`${i + 1}. ${l.length ? `(${l.join(", ")}) ` : ""}${s.g}${s.e ? `\n   > ${s.e}` : ""}`);
      });
      out.push("");
    }
  }
  const et = p.entries.find((e) => e.et)?.et;
  if (et) out.push("## Étymologie", "", et, "");

  out.push("## Sources et licence", "");
  if (p.entries.length)
    out.push(`- Wiktionnaire, « ${p.w} » : https://fr.wiktionary.org/wiki/${encodeURIComponent(p.w)} (CC BY-SA 4.0)`);
  if (p.th) out.push("- Thésaurus français Dicollecte (LibreOffice), LGPL 2.1+");
  out.push("");
  return out.join("\n");
}

export function siteMarkdown(): string {
  return `# Synonyma

> Dictionnaire ouvert des synonymes et antonymes français : ${formatNumber(DATA_STATS.words)} mots, ${formatNumber(
    DATA_STATS.relations,
  )} relations de synonymie et d’antonymie, avec définitions, exemples, prononciation et étymologie. Données libres issues du Wiktionnaire (CC BY-SA 4.0) et du thésaurus Dicollecte (LGPL). Aucun contenu généré par IA.

Langue : français. Dernière compilation des données : ${DATA_STATS.builtAt}.

## Comment utiliser ce site

- Fiche d’un mot : \`${SITE.url}/{mot}\` (ex. ${SITE.url}/manger). Les variantes (majuscules, sans accents, formes conjuguées ou accordées) redirigent vers la forme canonique.
- Version Markdown d’une fiche : \`${SITE.url}/{mot}.md\` (ex. ${SITE.url}/manger.md), ou en-tête \`Accept: text/markdown\`.
- Recherche par préfixe (JSON) : \`${SITE.url}/api/search?q={début du mot}\`.
- Index alphabétique : ${SITE.url}/dictionnaire et \`${SITE.url}/dictionnaire/{lettre}\`.
- Sitemaps : ${SITE.url}/robots.txt.

## Pages principales

- [Accueil](${SITE.url}/)
- [Dictionnaire A–Z](${SITE.url}/dictionnaire)
- [À propos, sources et méthode](${SITE.url}/a-propos)
- [Conditions d’utilisation et licences](${SITE.url}/cgu)

## Exemples de fiches

- [Synonymes de beau](${SITE.url}/beau.md)
- [Synonymes de important](${SITE.url}/important.md)
- [Synonymes de manger](${SITE.url}/manger.md)
- [Synonymes de triste](${SITE.url}/triste.md)

## Citer Synonyma

Citez la fiche (« Synonymes de X », Synonyma, ${SITE.url}/X) et, pour les définitions, le Wiktionnaire sous licence CC BY-SA 4.0.
`;
}
