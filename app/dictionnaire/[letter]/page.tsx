import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LETTERS, RESERVED, wordHref, wordsForLetter, formatNumber } from "@/lib/data";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

const PER_PAGE = 300;

type Props = {
  params: Promise<{ letter: string }>;
  searchParams: Promise<{ page?: string }>;
};

export function generateStaticParams() {
  return LETTERS.map((letter) => ({ letter }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { letter } = await params;
  const n = Number((await searchParams).page) || 1;
  const L = letter.toUpperCase();
  const path = `/dictionnaire/${letter}${n > 1 ? `?page=${n}` : ""}`;
  return {
    title: `Mots commençant par ${L} : synonymes et antonymes${n > 1 ? ` (page ${n})` : ""}`,
    description: `Tous les mots commençant par la lettre ${L} dans le dictionnaire des synonymes Synonyma${n > 1 ? `, page ${n}` : ""}. Cliquez sur un mot pour voir ses synonymes, antonymes et définitions.`,
    alternates: { canonical: path },
    openGraph: { url: path },
  };
}

export default async function LetterPage({ params, searchParams }: Props) {
  const { letter } = await params;
  if (!LETTERS.includes(letter)) notFound();
  const all = wordsForLetter(letter).filter(([w]) => !RESERVED.has(w));
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const n = Math.min(Math.max(1, Number((await searchParams).page) || 1), pages);
  const rows = all.slice((n - 1) * PER_PAGE, n * PER_PAGE);

  return (
    <>
      <Header />
      <main id="contenu" className="page">
        <nav className="crumbs" aria-label="Fil d’Ariane">
          <Link href="/dictionnaire">Dictionnaire</Link>
        </nav>
        <h1 className="page__title">Mots en {letter.toUpperCase()}</h1>
        <p className="page__sub">
          {formatNumber(all.length)} mots commençant par {letter.toUpperCase()}, avec leur nombre de synonymes · page {n} sur {pages}
        </p>
        <nav className="letters" aria-label="Lettres de l’alphabet">
          {LETTERS.map((l) => (
            <Link key={l} href={`/dictionnaire/${l}`} aria-current={l === letter ? "page" : undefined} aria-label={`Mots commençant par ${l.toUpperCase()}`}>
              {l}
            </Link>
          ))}
        </nav>
        <ul className="wordlist">
          {rows.map(([w, , s]) => (
            <li key={w}>
              <Link href={wordHref(w)} prefetch={false}>{w}</Link>
              <span title={`${s} synonymes`}>{s}</span>
            </li>
          ))}
        </ul>
        <nav className="pager" aria-label="Pagination">
          {n > 1 ? <Link href={`/dictionnaire/${letter}?page=${n - 1}`}>← Page précédente</Link> : <span />}
          {n < pages ? <Link href={`/dictionnaire/${letter}?page=${n + 1}`}>Page suivante →</Link> : <span />}
        </nav>
      </main>
      <Footer />
      <JsonLd
        data={breadcrumb([
          { name: "Accueil", path: "/" },
          { name: "Dictionnaire", path: "/dictionnaire" },
          { name: `Lettre ${letter.toUpperCase()}`, path: `/dictionnaire/${letter}` },
        ])}
      />
    </>
  );
}
