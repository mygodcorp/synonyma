import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { GetStaticPaths, GetStaticProps } from "next";
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
  console.log(props);
  return (
    <div className="mx-auto">
      <div className="grid items-center h-screen p-6">
        <div className="flex justify-center flex-col">
          {props.words.map((prop) => (
            <Link key={prop.id} className="py-1" href={`/${prop.slug}`}>
              <div className="text-xs text-zinc-400">
                {`${process.env.NEXT_PUBLIC_BASE_URL} / ${prop.slug}`}
              </div>
              <h2 className="text-blue-700 text-xl capitalize font-medium">
                {prop.word}
              </h2>
              <div className="text-sm">
                {prop.definition ? prop.definition : "pas encore de definition"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dictionnaire;

export const getStaticProps: GetStaticProps<{
  words: IParams[] | null;
}> = async () => {
  const { data: words } = await supabase
    .from("_word")
    .select("*")
    .like("word", `b%`)
    .order("word", { ascending: true });
  return { props: { words }, revalidate: 10000 };
};
