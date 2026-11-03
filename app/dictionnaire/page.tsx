import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DATA_STATS, LETTERS, formatNumber } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dictionnaire des synonymes de A à Z",
  description: "Tous les mots du dictionnaire des synonymes Synonyma, classés par ordre alphabétique.",
  alternates: { canonical: "/dictionnaire" },
};

export default function Dictionary() {
  return (
    <>
      <Header />
      <main className="page">
        <h1 className="page__title">Dictionnaire</h1>
        <p className="page__sub">
          {formatNumber(DATA_STATS.words)} mots, classés de A à Z. Choisissez une lettre.
        </p>
        <nav className="letters" aria-label="Lettres">
          {LETTERS.map((l) => (
            <Link key={l} href={`/dictionnaire/${l}`}>
              {l}
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
    </>
  );
}
