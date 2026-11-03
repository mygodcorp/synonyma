import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, ORGANIZATION, WEBSITE } from "@/lib/jsonld";
import { SITE } from "@/lib/site";
import type { CSSProperties } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchBox } from "@/components/search-box";
import { Shelf } from "@/components/shelf";
import { ChevronIcon } from "@/components/icons";
import { DATA_STATS, dayIndex, getIndex, getPage, wordHref, formatNumber } from "@/lib/data";
import { POPULAR, TRENDING, TRY, WORD_OF_THE_DAY } from "@/lib/featured";
import { bookColor, coverColor, spineSize } from "@/lib/palette";
import { firstDefinition, rankedSynonyms } from "@/lib/summary";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

function rotate<T>(list: T[], start: number): T[] {
  return [...list.slice(start), ...list.slice(0, start)];
}

export default function Home() {
  const today = new Date();
  const picks = rotate(WORD_OF_THE_DAY, dayIndex(WORD_OF_THE_DAY.length, today)).slice(0, 5);
  const featured = getPage(picks[0])!;
  const featuredDef = firstDefinition(featured);
  const featuredSyn = rankedSynonyms(featured).slice(0, 4).map((r) => r.w);

  // Three day-stable discoveries among richly-linked single words.
  const rich = getIndex().filter((r) => r[2] >= 8 && !r[0].includes(" ") && r[0] === r[0].toLowerCase());
  const discoveries = [0, 1, 2]
    .map((k) => rich[(dayIndex(rich.length, today) + k * 7919) % rich.length][0])
    .map((w) => getPage(w)!)
    .filter(Boolean);

  const books = POPULAR.map((w) => {
    const c = bookColor(w);
    const s = spineSize(w);
    return { w, c: c.c, t: c.t, width: s.w, height: s.h };
  });

  return (
    <>
      <Header home />
      <main id="contenu">
        <section className="home-hero">
          <div className="home-hero__left">
            <h1 className="wordmark">
              Synonyma <small>v2</small>
            </h1>
            <p className="home-hero__tag">Le dictionnaire ouvert des synonymes et antonymes français.</p>
            <SearchBox variant="hero" placeholder="Chercher un mot" />
            <div className="chips">
              <span>Tendances</span>
              {TRENDING.map((w) => (
                <Link key={w} className="chip" href={wordHref(w)}>
                  {w}
                </Link>
              ))}
            </div>
          </div>

          <div className="home-hero__right">
            <Link href={wordHref(featured.w)} className="book-stage" aria-label={`Mot du jour : ${featured.w}`}>
              <div className="book" style={{ "--book": coverColor(featured.w) } as CSSProperties}>
                <div className="book__spine" />
                <div className="book__cover">
                  <span className="book__kicker">Synonyma</span>
                  <span className="book__title">{featured.w}</span>
                  <span className="book__orn" aria-hidden>❦</span>
                </div>
                <div className="book__pages" />
              </div>
            </Link>
            <div>
              <p className="featured__label">Mot du jour</p>
              <h2 className="featured__title">{featured.w}</h2>
              {featuredDef && (
                <p className="featured__text">
                  <em>{featuredDef.pos}.</em> {featuredDef.gloss}
                  {featuredSyn.length > 0 && <> Synonymes : {featuredSyn.join(", ")}.</>}
                </p>
              )}
              <Link className="featured__more" href={wordHref(featured.w)}>
                Lire la fiche <ChevronIcon width={14} height={14} />
              </Link>
              <nav className="featured__list" aria-label="Mots à découvrir">
                {picks.map((w, i) => (
                  <Link key={w} href={wordHref(w)}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{w}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </section>

        <div className="ticker">
          <span>
            <span className="dot" />
            <strong>{formatNumber(DATA_STATS.words)}</strong> mots · {formatNumber(DATA_STATS.relations)} relations de
            synonymie et d’antonymie
          </span>
          <Link href="/dictionnaire" className="section__aside">
            Parcourir le dictionnaire →
          </Link>
        </div>

        <Shelf title="Les plus consultés" sub="Les mots dont on cherche le plus souvent un synonyme." books={books} />

        <section className="section" aria-labelledby="discover-title">
          <div className="section__head">
            <div>
              <h2 className="section__title" id="discover-title">À découvrir</h2>
              <p className="section__sub">Trois mots tirés du dictionnaire, renouvelés chaque jour.</p>
            </div>
            <Link href="/hasard" prefetch={false} rel="nofollow" className="section__aside">
              Un mot au hasard →
            </Link>
          </div>
          <div className="cards">
            {discoveries.map((p) => {
              const def = firstDefinition(p);
              const syn = rankedSynonyms(p);
              return (
                <Link key={p.w} href={wordHref(p.w)} className="card">
                  <div className="card__top">
                    <span className="card__title">{p.w}</span>
                    <span className="card__meta">{syn.length} synonymes</span>
                  </div>
                  <p className="card__pos">{def?.pos ?? p.th?.[0]?.p ?? "Thésaurus"}</p>
                  {def && <p className="card__text">{def.gloss}</p>}
                  <p className="card__syn">{syn.slice(0, 5).map((r) => r.w).join(" · ")}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="missing" aria-labelledby="missing-title">
          <h2 id="missing-title">Le mot juste vous échappe ?</h2>
          <p>Tapez le mot qui vous vient. Synonyma vous propose les autres.</p>
          <SearchBox variant="missing" placeholder="épanouissement" />
          <div className="chips">
            <span>Essayez</span>
            {TRY.map((w, i) => (
              <span key={w}>
                <Link href={wordHref(w)}>{w}</Link>
                {i < TRY.length - 1 ? " ·" : ""}
              </span>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={[
          WEBSITE,
          ORGANIZATION,
          { "@type": "WebPage", "@id": `${SITE.url}/#webpage`, url: SITE.url, name: "Synonyma", isPartOf: { "@id": WEBSITE["@id"] }, inLanguage: "fr-FR", description: SITE.description },
        ]}
      />
    </>
  );
}
