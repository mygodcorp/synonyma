import Link from "next/link";
import { DATA_STATS, formatNumber } from "@/lib/data";
import { Logo } from "./header";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glyph" aria-hidden>
        S
      </div>
      <div className="footer__grid">
        <div>
          <Logo />
          <p className="footer__about">
            Le dictionnaire ouvert des synonymes et antonymes français, construit sur le Wiktionnaire et le thésaurus
            Dicollecte. Gratuit, sans publicité, sans compte.
          </p>
          <p className="footer__count">
            <strong>{formatNumber(DATA_STATS.words)}</strong> mots
          </p>
        </div>
        <div>
          <h2 className="footer__h">Explorer</h2>
          <ul>
            <li><Link href="/dictionnaire">Dictionnaire A–Z</Link></li>
            <li><Link href="/hasard" prefetch={false} rel="nofollow">Un mot au hasard</Link></li>
            <li><Link href="/#plus-consultes">Les plus consultés</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="footer__h">Contribuer</h2>
          <ul>
            <li><a href="https://fr.wiktionary.org/wiki/Wiktionnaire:Page_d%E2%80%99accueil" rel="noopener">Le projet Wiktionnaire</a></li>
            <li><a href="https://grammalecte.net" rel="noopener">Grammalecte / Dicollecte</a></li>
            <li><a href="https://github.com/mygodcorp/synonyma" rel="noopener">Code source</a></li>
          </ul>
        </div>
        <div>
          <h2 className="footer__h">Synonyma</h2>
          <ul>
            <li><Link href="/a-propos">À propos</Link></li>
            <li><Link href="/a-propos#methode">Méthode éditoriale</Link></li>
            <li><Link href="/a-propos#contact">Contact</Link></li>
            <li><Link href="/cgu#confidentialite">Confidentialité</Link></li>
            <li><Link href="/cgu">Conditions d’utilisation</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Synonyma</span>
        <nav aria-label="Informations légales">
          <Link href="/cgu">CGU</Link>
          <Link href="/cgu#sources">Données : Wiktionnaire (CC BY-SA) et Dicollecte (LGPL)</Link>
        </nav>
      </div>
    </footer>
  );
}
