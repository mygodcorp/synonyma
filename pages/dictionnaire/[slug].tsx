import { PostgrestSingleResponse } from "@supabase/supabase-js";
import Glossary from "components/glossary";
import { supabase } from "lib/supabase/supabase";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { ParsedUrlQueryInput } from "querystring";

interface IParams extends ParsedUrlQueryInput {
  created_at: string;
  word: string;
  synonyme_processed: false;
  definition: string | null;
  slug: string;
  id: string;
  definition_processed: false;
}

function Dictionnaire(props: { words: IParams[]; letter: string }) {
  return (
    <>
      <NextSeo
        title={`Lettre ${props.letter.toUpperCase()} : Mots et Synonymes qui commencent par la lettre ${props.letter.toUpperCase()}`}
        description={`Synonymes des mots de la lettre ${props.letter.toUpperCase()} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`}
        defaultTitle={`Mots et synonymes qui commencent par la lettre ${props.letter.toUpperCase()}`}
        canonical={`https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/dictionnaire/${props.letter}`}
        openGraph={{
          title: `Lettre ${props.letter.toUpperCase()} : Mots et Synonymes qui commencent par la lettre ${props.letter.toUpperCase()}`,
          type: "article",
          images: [
            { url: `https://synonyma.fr/api/image?word=${props.letter}` },
          ],
          description: `Synonymes des mots de la lettre ${props.letter.toUpperCase()} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`,
        }}
      />
      <div className="mx-auto">
        <div className="items-center p-6">
          <div className="flex justify-center flex-col">
            <ul>
              {props.words.map((prop) => (
                <Link key={prop.id} className="py-1" href={`/${prop.word}`}>
                  <h2 className="text-blue-700 text-xl capitalize font-medium">
                    {prop.word}
                  </h2>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dictionnaire;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
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
  ].map((item) => {
    return {
      params: { slug: item.toLocaleLowerCase() },
    };
  });
  return { fallback: false, paths };
};

export const getStaticProps: GetStaticProps<{
  words: IParams[] | null;
}> = async (context) => {
  const { data: words } = await supabase
    .from("_word")
    .select("*")
    .like("word", `${context.params?.slug as string}%`)
    .order("word", { ascending: true });
  return { props: { words, letter: context.params?.slug }, revalidate: 10000 };
};
