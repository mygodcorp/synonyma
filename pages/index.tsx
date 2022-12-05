import { NextSeo } from "next-seo";
import Link from "next/link";

function Home() {
  return (
    <>
      <div className="isolate bg-neutral-100">
        <div className="px-6 pt-6 lg:px-8">
          <div>
            <nav
              className="flex h-9 items-center justify-between"
              aria-label="Global"
            >
              <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <a href="#" className="-m-1.5 p-1.5">
                  <h1 className="sr-only">Synonyma</h1>
                </a>
              </div>
            </nav>
          </div>
        </div>
        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
              <div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-center sm:text-3xl">
                    Recherchez des synonymes
                  </h2>
                  <div className="mt-8 flex gap-x-4 sm:justify-center">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block h-12 w-full rounded-full border-none px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Aimer"
                    />
                  </div>
                </div>
                <ul className="flex  justify-between pt-12">
                  {[
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                    "G",
                    "H",
                    "I",
                    "J",
                    "K",
                    "L",
                    "M",
                    "N",
                    "O",
                    "P",
                    "Q",
                    "R",
                    "S",
                    "T",
                    "U",
                    "V",
                    "W",
                    "X",
                    "Y",
                    "Z",
                  ].map((letter) => (
                    <li key={letter}>
                      <Link
                        href={`/dictionnaire/${letter.toLowerCase()}`}
                        className="font-semibold text-gray-900 hover:text-gray-900"
                      >
                        {letter}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
