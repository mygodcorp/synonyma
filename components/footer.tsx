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
          <h3>Explorer</h3>
          <ul>
            <li><Link href="/dictionnaire">Dictionnaire A–Z</Link></li>
            <li><Link href="/hasard" prefetch={false}>Un mot au hasard</Link></li>
            <li><Link href="/#plus-consultes">Les plus consultés</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contribuer</h3>
          <ul>
            <li><a href="https://fr.wiktionary.org/wiki/Wiktionnaire:Page_d%E2%80%99accueil" rel="noopener">Wiktionnaire</a></li>
            <li><a href="https://grammalecte.net" rel="noopener">Dicollecte</a></li>
            <li><a href="https://github.com/mygodcorp/synonyma" rel="noopener">Code source</a></li>
          </ul>
        </div>
        <div>
          <h3>Synonyma</h3>
          <ul>
            <li><Link href="/cgu#sources">Sources et licences</Link></li>
            <li><Link href="/cgu">Conditions d’utilisation</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Synonyma</span>
        <nav>
          <Link href="/cgu">CGU</Link>
          <Link href="/cgu#sources">Données : Wiktionnaire (CC BY-SA) et Dicollecte (LGPL)</Link>
        </nav>
      </div>
    </footer>
  );
}
