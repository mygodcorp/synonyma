import { PostgrestSingleResponse } from "@supabase/supabase-js";
import Glossary from "components/glossary";
import { supabase } from "lib/supabase";
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

function Dictionnaire(props: { words: IParams[] }) {
  return (
    <>
      <NextSeo
        title="Mots qui commencent par a"
        description="mots qui commencent par a"
      />
      <div className="mx-auto">
        <div className="items-center p-6">
          <div className="flex justify-center flex-col">
            <ul>
              {props.words.map((prop) => (
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
  return { props: { words }, revalidate: 10000 };
};
