import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DATA_STATS, formatNumber } from "@/lib/data";
import { JsonLd, ORGANIZATION, abs, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "À propos : sources, méthode et contact",
  description:
    "Comment Synonyma est construit : sources libres (Wiktionnaire, Dicollecte), méthode de compilation des synonymes et antonymes, mises à jour, limites et contact.",
  alternates: { canonical: "/a-propos" },
  openGraph: { url: "/a-propos" },
};

export default function About() {
  const updated = new Date(DATA_STATS.builtAt + "T12:00:00Z").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <>
      <Header />
      <main id="contenu" className="page" style={{ maxWidth: 760 }}>
        <h1 className="page__title">À propos de Synonyma</h1>
        <p className="page__sub">Un dictionnaire des synonymes français ouvert, gratuit et sans publicité.</p>
        <div className="legal">
          <h2>Ce que contient Synonyma</h2>
          <p>
            Synonyma réunit {formatNumber(DATA_STATS.words)} mots et expressions de la langue française et{" "}
            {formatNumber(DATA_STATS.relations)} relations de synonymie et d’antonymie. Chaque fiche présente les
            synonymes classés par sens, les antonymes, les définitions illustrées d’exemples, la prononciation en
            alphabet phonétique et l’étymologie quand elle est connue.
          </p>

          <h2 id="methode">Méthode éditoriale</h2>
          <p>
            Synonyma ne rédige pas ses propres définitions et ne génère aucun contenu par intelligence artificielle.
            Toutes les informations proviennent de deux ouvrages collaboratifs et libres, relus par leurs communautés :
          </p>
          <p>
            <strong>Le Wiktionnaire</strong>, dictionnaire libre maintenu par des milliers de contributeurs, fournit les
            définitions, exemples, prononciations, étymologies, synonymes et antonymes. Les données sont extraites par
            le projet <a href="https://kaikki.org/frwiktionary/">kaikki.org</a> (Wiktextract).
          </p>
          <p>
            <strong>Le thésaurus Dicollecte</strong>, dictionnaire des synonymes de LibreOffice, complète les synonymes
            regroupés par sens.
          </p>
          <p>
            Lors de la compilation, Synonyma ajoute les relations inverses (le Wiktionnaire donne « triste » comme
            synonyme de « cafardeux » : la fiche « triste » renvoie donc aussi vers « cafardeux »), retire les doublons et ne crée de lien
            que vers des mots qui ont eux-mêmes une fiche. Les formes conjuguées ou accordées (« mangeons »,
            « belles ») renvoient vers le mot de base.
          </p>

          <h2>Mises à jour</h2>
          <p>
            Les données sont recompilées depuis les sources à chaque mise à jour du site. Dernière compilation :{" "}
            <time dateTime={DATA_STATS.builtAt}>{updated}</time>. Chaque fiche renvoie vers sa page d’origine sur le
            Wiktionnaire.
          </p>

          <h2>Limites</h2>
          <p>
            Un synonyme n’est jamais parfaitement interchangeable : vérifiez le sens et le registre (familier, vieilli,
            régional…) indiqués à côté du mot avant de l’employer. Certains mots très courants ont peu de synonymes
            recensés dans les sources ; la couverture progresse avec les contributions au Wiktionnaire.
          </p>

          <h2 id="contact">Contact</h2>
          <p>
            Pour signaler une erreur ou proposer une amélioration du site, ouvrez un ticket sur{" "}
            <a href="https://github.com/mygodcorp/synonyma/issues">GitHub</a>. Pour corriger un synonyme ou une
            définition, modifiez directement la page du Wiktionnaire : la correction sera reprise à la prochaine
            compilation.
          </p>
          <p>
            Voir aussi les <Link href="/cgu">conditions d’utilisation</Link> et la{" "}
            <Link href="/cgu#confidentialite">politique de confidentialité</Link>.
          </p>
        </div>
      </main>
      <Footer />
      <JsonLd
        data={[
          { "@type": "AboutPage", url: abs("/a-propos"), name: "À propos de Synonyma", about: { "@id": ORGANIZATION["@id"] }, inLanguage: "fr-FR", dateModified: DATA_STATS.builtAt },
          breadcrumb([
            { name: "Accueil", path: "/" },
            { name: "À propos", path: "/a-propos" },
          ]),
        ]}
      />
    </>
  );
}
