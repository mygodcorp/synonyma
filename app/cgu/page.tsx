import type { Metadata } from "next";
import { og } from "@/lib/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DATA_STATS, formatNumber } from "@/lib/data";

export const metadata: Metadata = {
  title: "Conditions d’utilisation, sources et licences",
  description: "Conditions d’utilisation de Synonyma, sources des données (Wiktionnaire, Dicollecte), licences et politique de confidentialité.",
  alternates: { canonical: "/cgu" },
  openGraph: og("/cgu"),
};

export default function Cgu() {
  return (
    <>
      <Header />
      <main id="contenu" className="page" style={{ maxWidth: 760 }}>
        <h1 className="page__title">Conditions d’utilisation</h1>
        <div className="legal">
          <h2>Le service</h2>
          <p>
            Synonyma est un dictionnaire gratuit de synonymes, d’antonymes et de définitions de la langue française. Il
            ne demande aucun compte et ne collecte aucune donnée personnelle. Une mesure d’audience anonyme (Vercel Web
            Analytics, sans cookie) compte les pages vues.
          </p>
          <p>
            Les informations sont fournies telles quelles, sans garantie d’exactitude ni d’exhaustivité. Vérifiez le
            sens d’un synonyme dans son contexte avant de l’employer.
          </p>

          <h2 id="sources">Sources et licences</h2>
          <p>
            Synonyma réunit {formatNumber(DATA_STATS.words)} mots issus de deux sources
            libres. Dernière mise à jour des données : {DATA_STATS.builtAt}.
          </p>
          <p>
            <strong>Wiktionnaire.</strong> Définitions, exemples, prononciations, étymologies, synonymes et antonymes
            proviennent du <a href="https://fr.wiktionary.org">Wiktionnaire</a>, extraits par{" "}
            <a href="https://kaikki.org/frwiktionary/">kaikki.org</a> (Wiktextract). Ces contenus sont publiés sous
            licence <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr">Creative Commons BY-SA 4.0</a>{" "}
            par les contributeurs du Wiktionnaire. Synonyma les reprend sous la même licence ; chaque fiche renvoie à
            la page d’origine.
          </p>
          <p>
            <strong>Thésaurus Dicollecte.</strong> Une partie des synonymes provient du dictionnaire des synonymes
            français de LibreOffice (myThes, version 2.3, par Frédéric Labbé et la communauté{" "}
            <a href="https://grammalecte.net">Dicollecte</a>), distribué sous licence{" "}
            <a href="https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html">GNU LGPL 2.1 ou ultérieure</a>.
          </p>
          <p>
            Le code du site est public sur <a href="https://github.com/mygodcorp/synonyma">GitHub</a>.
          </p>

          <h2 id="confidentialite">Données personnelles et confidentialité</h2>
          <p>
            Synonyma ne dépose aucun cookie, ne demande ni compte ni adresse e-mail et n’affiche aucune publicité. La
            mesure d’audience (Vercel Web Analytics) est agrégée et anonyme : elle ne suit pas les visiteurs d’un site à
            l’autre. Le choix du thème clair ou sombre est enregistré uniquement dans votre navigateur. Les recherches
            tapées dans le champ de recherche ne sont pas conservées.
          </p>

          <h2>Contact</h2>
          <p>
            Pour signaler une erreur dans une définition ou un synonyme, le plus efficace est de corriger directement
            le Wiktionnaire : les corrections sont reprises à la mise à jour suivante.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
