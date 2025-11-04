import Link from "next/link";

export default function Glossary({
  words,
  letter,
}: {
  words: IParams[];
  letter: string;
}) {
  return (
    <div className="mx-auto">
      <div className="items-center p-6">
        <div className="flex justify-center flex-col">
          <h1 className="text-3xl">{`Mots qui commencent par ${letter}`}</h1>
          <ul className="flex columns-3">
            {words.map((prop) => (
              <Link key={prop.id} className="py-1" href={`/${prop.slug}`}>
                <h2 className="text-blue-700 text-xl capitalize font-medium">
                  {prop.word}
                </h2>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
