import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DATA_STATS, LETTERS, RESERVED, formatNumber, wordHref, wordsForLetter } from "@/lib/data";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Dictionnaire des synonymes de A à Z",
  description: `Les ${formatNumber(DATA_STATS.words)} mots du dictionnaire des synonymes Synonyma, classés de A à Z, avec leurs synonymes, antonymes et définitions.`,
  alternates: { canonical: "/dictionnaire" },
  openGraph: { url: "/dictionnaire" },
};

/** Most-connected single words for a letter: a useful entry point and a strong internal link. */
function topWords(letter: string, n = 12) {
  return wordsForLetter(letter)
    .filter(([w]) => !w.includes(" ") && w === w.toLowerCase() && !RESERVED.has(w))
    .sort((a, b) => b[2] + b[3] - (a[2] + a[3]))
    .slice(0, n)
    .map(([w]) => w)
    .sort((a, b) => a.localeCompare(b, "fr"));
}

export default function Dictionary() {
  return (
    <>
      <Header />
      <main id="contenu" className="page">
        <h1 className="page__title">Dictionnaire des synonymes</h1>
        <p className="page__sub">
          {formatNumber(DATA_STATS.words)} mots classés de A à Z. Chaque fiche réunit les synonymes, les antonymes, les
          définitions et l’étymologie du mot, d’après le Wiktionnaire et le thésaurus Dicollecte.
        </p>
        <nav className="letters" aria-label="Lettres de l’alphabet">
          {LETTERS.map((l) => (
            <Link key={l} href={`/dictionnaire/${l}`} aria-label={`Mots commençant par ${l.toUpperCase()}`}>
              {l}
            </Link>
          ))}
        </nav>
        <div className="letter-tops">
          {LETTERS.map((l) => (
            <section key={l} aria-labelledby={`l-${l}`}>
              <h2 id={`l-${l}`}>
                <Link href={`/dictionnaire/${l}`}>Mots en {l.toUpperCase()}</Link>
              </h2>
              <p>
                {topWords(l).map((w, i, a) => (
                  <span key={w}>
                    <Link href={wordHref(w)} prefetch={false}>{w}</Link>
                    {i < a.length - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
      <JsonLd
        data={breadcrumb([
          { name: "Accueil", path: "/" },
          { name: "Dictionnaire", path: "/dictionnaire" },
        ])}
      />
    </>
  );
}
