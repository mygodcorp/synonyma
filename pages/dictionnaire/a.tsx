import { PostgrestSingleResponse } from "@supabase/supabase-js";
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
        <div className="grid items-center h-screen p-6">
          <div className="flex justify-center flex-col">
            <h1 className="text-3xl">Mots qui commencent par a</h1>
            {props.words.map((prop) => (
              <Link key={prop.id} className="py-1" href={`/${prop.slug}`}>
                <h2 className="text-blue-700 text-xl capitalize font-medium">
                  {prop.word}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dictionnaire;

export const getStaticProps: GetStaticProps<{
  words: IParams[] | null;
}> = async () => {
  const { data: words } = await supabase
    .from("_word")
    .select("*")
    .like("word", `a%`)
    .order("word", { ascending: true });
  return { props: { words }, revalidate: 10000 };
};
