export default function Header() {
  return (
    <nav
      aria-label="Site Nav"
      className="mx-auto flex max-w-screen-xl items-center justify-between p-4"
    >
      <a
        href="/"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
      >
        <span className="sr-only">Logo</span>
        👋
      </a>
    </nav>
  );
}
