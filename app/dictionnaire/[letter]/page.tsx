import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LETTERS, wordHref, wordsForLetter, formatNumber } from "@/lib/data";

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
  return {
    title: `Synonymes des mots en ${L}${n > 1 ? ` (page ${n})` : ""}`,
    description: `Liste des mots commençant par ${L} dans le dictionnaire des synonymes Synonyma.`,
    alternates: { canonical: `/dictionnaire/${letter}${n > 1 ? `?page=${n}` : ""}` },
  };
}

export default async function LetterPage({ params, searchParams }: Props) {
  const { letter } = await params;
  if (!LETTERS.includes(letter)) notFound();
  const all = wordsForLetter(letter);
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const n = Math.min(Math.max(1, Number((await searchParams).page) || 1), pages);
  const rows = all.slice((n - 1) * PER_PAGE, n * PER_PAGE);

  return (
    <>
      <Header />
      <main className="page">
        <h1 className="page__title">Lettre {letter.toUpperCase()}</h1>
        <p className="page__sub">
          {formatNumber(all.length)} mots · page {n} sur {pages}
        </p>
        <nav className="letters" aria-label="Lettres">
          {LETTERS.map((l) => (
            <Link key={l} href={`/dictionnaire/${l}`} aria-current={l === letter ? "page" : undefined}>
              {l}
            </Link>
          ))}
        </nav>
        <ul className="wordlist">
          {rows.map(([w, , s]) => (
            <li key={w}>
              <Link href={wordHref(w)} prefetch={false}>{w}</Link>
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <nav className="pager" aria-label="Pagination">
          {n > 1 ? <Link href={`/dictionnaire/${letter}?page=${n - 1}`}>← Page précédente</Link> : <span />}
          {n < pages ? <Link href={`/dictionnaire/${letter}?page=${n + 1}`}>Page suivante →</Link> : <span />}
        </nav>
      </main>
      <Footer />
    </>
  );
}
