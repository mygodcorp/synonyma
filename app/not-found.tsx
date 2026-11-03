import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchBox } from "@/components/search-box";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu" className="page" style={{ textAlign: "center", minHeight: "60vh" }}>
        <h1 className="page__title">Mot introuvable</h1>
        <p className="page__sub">Ce mot n’a pas encore de synonymes dans Synonyma. Essayez une autre forme (l’infinitif, le masculin singulier).</p>
        <div style={{ maxWidth: 520, margin: "32px auto 16px" }}>
          <SearchBox variant="hero" autoFocus />
        </div>
        <Link href="/dictionnaire" className="section__aside">
          Parcourir le dictionnaire →
        </Link>
      </main>
      <Footer />
    </>
  );
}
