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
      <div className="header__end">
        <Link className="nav-link" href="/dictionnaire">
          Dictionnaire
        </Link>
        <Link className="nav-link" href="/hasard" prefetch={false}>
          Au hasard
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
