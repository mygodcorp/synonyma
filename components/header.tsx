import Link from "next/link";
import { SearchBox } from "./search-box";
import { ThemeToggle } from "./theme-toggle";

export function Logo({ size }: { size?: number }) {
  return (
    <Link href="/" className="logo" style={size ? { fontSize: size } : undefined} aria-label="Synonyma, accueil">
      Synonyma
    </Link>
  );
}

export function Header({ home = false }: { home?: boolean }) {
  return (
    <header className={home ? "header header--home" : "header"}>
      {home ? <span /> : <Logo />}
      {home ? <span /> : <SearchBox />}
      <nav className="header__end" aria-label="Navigation principale">
        <Link className="nav-link" href="/dictionnaire">
          Dictionnaire
        </Link>
        <Link className="nav-link" href="/hasard" prefetch={false} rel="nofollow">
          Au hasard
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
