import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment, type CSSProperties } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toc, type TocItem } from "@/components/toc";
import { ArticleTools } from "@/components/article-tools";
import { BookIcon } from "@/components/icons";
import { getIndex, getPage, resolveWord, richness, wordHref, type Relation } from "@/lib/data";
import { POPULAR, WORD_OF_THE_DAY } from "@/lib/featured";
import { genderLabel, labels } from "@/lib/labels";
import { coverColor } from "@/lib/palette";
import { allAntonyms, allSynonyms, firstDefinition, lowerFirst, metaDescription } from "@/lib/summary";
import { fold } from "@/lib/keys.mjs";

export const dynamicParams = true;
export const revalidate = false;

export function generateStaticParams() {
  return [...new Set([...POPULAR, ...WORD_OF_THE_DAY])].map((word) => ({ word }));
}

type Props = { params: Promise<{ word: string }> };

function decode(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const word = decode((await params).word);
  const page = getPage(word);
  if (!page) return { title: "Mot introuvable", robots: { index: false } };
  const title = `Synonymes de ${page.w}`;
  const description = metaDescription(page);
  return {
    title,
    description,
    alternates: { canonical: wordHref(page.w) },
    openGraph: { title: `${title} | Synonyma`, description, url: wordHref(page.w), type: "article" },
  };
}

function RelList({ items }: { items: Relation[] }) {
  return (
    <p className="rel">
      {items.map((r, i) => (
        <Fragment key={r.w}>
          <span className="rel__item">
            {r.l ? <Link href={wordHref(r.w)}>{r.w}</Link> : <span className="nolink">{r.w}</span>}
            {labels(r.t).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
            {i < items.length - 1 && <span className="sep">·</span>}
          </span>{" "}
        </Fragment>
      ))}
    </p>
  );
}

/** Group relations by the sense they were attached to on the Wiktionary page. */
function bySense(rels: Relation[]) {
  const groups = new Map<string, Relation[]>();
  for (const r of rels) {
    const k = r.s && !/^[\s()\d.,-]*$/.test(r.s) ? r.s : "";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(r);
  }
  return [...groups.entries()].sort((a, b) => (a[0] === "" ? -1 : b[0] === "" ? 1 : 0));
}

function neighbours(word: string, n = 6) {
  const rows = getIndex();
  const key = fold(word);
  let lo = 0;
  let hi = rows.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (rows[mid][1] < key) lo = mid + 1;
    else hi = mid;
  }
  const out: string[] = [];
  for (let i = Math.max(0, lo - n); i < Math.min(rows.length, lo + n + 1); i++) if (rows[i][0] !== word) out.push(rows[i][0]);
  return out;
}

export default async function WordPage({ params }: Props) {
  const raw = decode((await params).word);
  const page = getPage(raw);
  if (!page) {
    const resolved = resolveWord(raw);
    if (resolved) permanentRedirect(wordHref(resolved));
    notFound();
  }

  const w = page.w;
  const synEntries = page.entries.filter((e) => e.syn?.length);
  const antEntries = page.entries.filter((e) => e.ant?.length);
  const synonyms = allSynonyms(page);
  const antonyms = allAntonyms(page);
  const def = firstDefinition(page);
  const ipa = page.entries.find((e) => e.ipa)?.ipa;
  const gender = genderLabel(page.entries.find((e) => e.gen)?.gen);
  const natures = [...new Set([...page.entries.map((e) => e.p), ...(page.th ?? []).flatMap((g) => (g.p ? g.p.split(", ") : []))])];
  const etymology = page.entries.find((e) => e.et)?.et;
  const hasDefs = page.entries.some((e) => e.senses.length);
  const multiPos = synEntries.length + (page.rs?.length ? 1 : 0) + (page.th?.length ? 1 : 0) > 1;
  const near = neighbours(w);
  // Lead sentence: the most "central" plain synonyms (no usage label, linked, richest entries first).
  // Prefer the curated Wiktionary list of the main entry, fall back to the first thesaurus cluster.
  const plain = (r: Relation) => r.l && !labels(r.t).length && r.w.split(" ").length <= 2;
  const mainSyn = (page.entries.find((e) => e.syn?.length)?.syn ?? []).filter(plain);
  const leadPool = mainSyn.length >= 2 ? mainSyn : [...mainSyn, ...(page.th?.[0]?.w ?? []).filter(plain)];
  const leadSyn = [...leadPool].sort((a, b) => richness(b.w) - richness(a.w)).slice(0, 4);
  // Same part of speech can appear several times (homonyms): number them.
  const posCount = new Map<string, number>();
  page.entries.forEach((e) => posCount.set(e.p, (posCount.get(e.p) ?? 0) + 1));
  const seenPos = new Map<string, number>();
  const posLabels = page.entries.map((e) => {
    const n = (seenPos.get(e.p) ?? 0) + 1;
    seenPos.set(e.p, n);
    return posCount.get(e.p)! > 1 ? `${e.p} (${n})` : e.p;
  });

  const toc: TocItem[] = [];
  if (synonyms.length) {
    toc.push({ id: "synonymes", label: "Synonymes" });
    if (multiPos) {
      synEntries.forEach((e, i) => toc.push({ id: `synonymes-${i}`, label: posLabels[page.entries.indexOf(e)], sub: true }));
      if (page.rs?.length) toc.push({ id: "synonymes-autres", label: "Mots apparentés", sub: true });
      if (page.th?.length) toc.push({ id: "synonymes-thesaurus", label: "Thésaurus", sub: true });
    }
  }
  if (antonyms.length) toc.push({ id: "antonymes", label: "Antonymes" });
  if (hasDefs) {
    toc.push({ id: "definitions", label: "Définitions" });
    if (page.entries.length > 1) page.entries.forEach((e, i) => toc.push({ id: `definition-${i}`, label: posLabels[i], sub: true }));
  }
  if (etymology) toc.push({ id: "etymologie", label: "Étymologie" });
  toc.push({ id: "voisins", label: "Mots voisins" });
  toc.push({ id: "sources", label: "Sources" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: w,
    description: def?.gloss,
    inLanguage: "fr",
    url: wordHref(w),
    inDefinedTermSet: { "@type": "DefinedTermSet", name: "Synonyma, dictionnaire des synonymes" },
  };

  return (
    <>
      <Header />
      <div className="word-layout">
        <Toc items={toc} />
        <article className="article">
          <header className="article__head">
            <div>
              <h1 className="article__title">{w}</h1>
              <p className="article__meta">
                <BookIcon />
                <span>
                  {synonyms.length} synonyme{synonyms.length > 1 ? "s" : ""}
                  {antonyms.length > 0 && ` · ${antonyms.length} antonyme${antonyms.length > 1 ? "s" : ""}`}
                  {" · "}D’après {page.entries.length ? `le Wiktionnaire${page.th ? " et Dicollecte" : ""}` : "le thésaurus Dicollecte"}
                </span>
              </p>
            </div>
            <ArticleTools word={w} />
          </header>

          <div className="article__body">
            <div className="prose">
              <p className="lead" id="resume">
                <strong>{w}</strong>
                {ipa && <span className="muted"> {ipa}</span>}
                {def ? (
                  <>
                    {" "}
                    ({lowerFirst(def.pos)}) : {def.gloss}
                  </>
                ) : (
                  <> figure au thésaurus français.</>
                )}{" "}
                {leadSyn.length > 0 && (
                  <>
                    Parmi ses synonymes :{" "}
                    {leadSyn.map((r, i, a) => (
                      <span key={r.w}>
                        <Link href={wordHref(r.w)}>{r.w}</Link>
                        {i < a.length - 2 ? ", " : i === a.length - 2 ? " et " : ""}
                      </span>
                    ))}
                    .
                  </>
                )}
              </p>

              {synonyms.length > 0 && (
                <>
                  <h2 id="synonymes">Synonymes de {w}</h2>
                  {synEntries.map((e, i) => (
                    <div key={i}>
                      {multiPos && <h3 id={`synonymes-${i}`}>{posLabels[page.entries.indexOf(e)]}</h3>}
                      {bySense(e.syn!).map(([sense, rels]) => (
                        <div className="group" key={sense}>
                          {sense && <p className="group__label">{sense}</p>}
                          <RelList items={rels} />
                        </div>
                      ))}
                    </div>
                  ))}
                  {page.rs && page.rs.length > 0 && (
                    <div>
                      {multiPos && <h3 id="synonymes-autres">Mots apparentés</h3>}
                      <div className="group">
                        <p className="group__label">Mots qui donnent « {w} » comme synonyme</p>
                        <RelList items={page.rs.map((x) => ({ w: x, l: 1 }))} />
                      </div>
                    </div>
                  )}
                  {page.th && page.th.length > 0 && (
                    <div>
                      {multiPos && <h3 id="synonymes-thesaurus">Thésaurus</h3>}
                      {page.th.map((g, i) => (
                        <div className="group" key={i}>
                          <p className="group__label">
                            Sens {i + 1}
                            {g.p && <em> · {g.p}</em>}
                          </p>
                          <RelList items={g.w} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {antonyms.length > 0 && (
                <>
                  <h2 id="antonymes">Antonymes de {w}</h2>
                  {antEntries.map((e, i) => (
                    <div key={i}>
                      {antEntries.length > 1 && <h3>{posLabels[page.entries.indexOf(e)]}</h3>}
                      {bySense(e.ant!).map(([sense, rels]) => (
                        <div className="group" key={sense}>
                          {sense && <p className="group__label">{sense}</p>}
                          <RelList items={rels} />
                        </div>
                      ))}
                    </div>
                  ))}
                  {page.ra && page.ra.length > 0 && (
                    <div className="group">
                      <p className="group__label">Mots qui donnent « {w} » comme antonyme</p>
                      <RelList items={page.ra.map((x) => ({ w: x, l: 1 }))} />
                    </div>
                  )}
                </>
              )}

              {hasDefs && (
                <>
                  <h2 id="definitions">Définitions</h2>
                  {page.entries.map((e, i) => (
                    <div key={i}>
                      <h3 id={`definition-${i}`}>
                        {posLabels[i]}
                        {e.ipa && <span className="muted" style={{ fontFamily: "var(--font-sans)", fontSize: 14 }}> {e.ipa}</span>}
                      </h3>
                      <ol className="senses">
                        {e.senses.map((s, j) => (
                          <li key={j}>
                            {labels(s.t).map((t) => (
                              <span key={t} className="tag" style={{ marginLeft: 0, marginRight: 6 }}>{t}</span>
                            ))}
                            {s.g}
                            {s.e && <span className="ex">{s.e}</span>}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </>
              )}

              {etymology && (
                <>
                  <h2 id="etymologie">Étymologie</h2>
                  <p>{etymology}</p>
                </>
              )}

              <h2 id="voisins">Mots voisins</h2>
              <RelList items={near.map((x) => ({ w: x, l: 1 }))} />

              <h2 id="sources">Sources</h2>
              <ol className="refs">
                {page.entries.length > 0 && (
                <li>
                  «{" "}
                  <a href={`https://fr.wiktionary.org/wiki/${encodeURIComponent(w)}`} rel="noopener">
                    {w}
                  </a>{" "}
                  », Wiktionnaire, le dictionnaire libre. Texte sous licence{" "}
                  <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr" rel="noopener">CC BY-SA 4.0</a>.
                </li>
                )}
                {page.th && (
                  <li>
                    Thésaurus français Dicollecte (LibreOffice), licence{" "}
                    <a href="https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html" rel="noopener">LGPL 2.1</a>.
                  </li>
                )}
              </ol>
              <p className="note">
                Une erreur, un synonyme manquant ? Corrigez la page du Wiktionnaire : la prochaine mise à jour de
                Synonyma la reprendra.
              </p>
            </div>

            <aside className="infobox" aria-label={`Fiche de ${w}`}>
              <div className="infobox__head">{w}</div>
              <div className="infobox__art" style={{ "--book": coverColor(w) } as CSSProperties} aria-hidden>
                {w}
              </div>
              <dl>
                {ipa && (
                  <>
                    <dt>Prononciation</dt>
                    <dd>{ipa}</dd>
                  </>
                )}
                {natures.length > 0 && (
                  <>
                    <dt>Nature</dt>
                    <dd>{natures.join(", ")}</dd>
                  </>
                )}
                {gender && (
                  <>
                    <dt>Genre</dt>
                    <dd>{gender}</dd>
                  </>
                )}
                <dt>Synonymes</dt>
                <dd>{synonyms.length}</dd>
                <dt>Antonymes</dt>
                <dd>{antonyms.length}</dd>
                <dt>Source</dt>
                <dd>
                  {page.entries.length > 0 && (
                    <a href={`https://fr.wiktionary.org/wiki/${encodeURIComponent(w)}`} rel="noopener">Wiktionnaire</a>
                  )}
                  {page.entries.length > 0 && page.th && ", "}
                  {page.th && "Dicollecte"}
                </dd>
              </dl>
            </aside>
          </div>
        </article>
      </div>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
