export default function Footer() {
  return (
    <footer aria-label="Site Footer">
      <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <p className="mx-auto mt-6 max-w-md text-center text-gray-500 lg:text-left">
              Synonyma.fr aide des millions de personnes à améliorer leur
              maîtrise de la langue française et à trouver le mot exact grâce à
              des millions de synonymes et d'antonymes.
            </p>
          </div>
        </div>
        <p className="mt-12 text-center text-sm text-gray-500 lg:text-right">
          Copyright &copy; 2022. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
