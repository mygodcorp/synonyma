import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { ParsedUrlQueryInput } from "querystring";

interface IParams {
  created_at: string;
  word: string;
  synonyme_processed: false;
  definition: string | null;
  slug: string;
  id: string;
  definition_processed: false;
  synonymes: Array<{ item: IParams }>;
}

function Synonyme(props: { word: IParams }) {
  console.log(props);
  return (
    <>
      <NextSeo
        title={`synonymes de ${props.word.word}`}
        description={`Tous les synonymes de ${props.word.word}`}
      />
      <div className="mx-auto">
        <div className="grid items-center p-6">
          <div className="prose flex justify-center flex-col">
            <h1>
              <span>Synonymes de </span>
              <span className="capitalize">{props.word.word}</span>
            </h1>
            <p>{props.word.definition}</p>
            {props.word.synonymes.map(({ item }) => (
              <Link key={item.id} className="py-1" href={`/${item.slug}`}>
                <div className="text-xs text-zinc-400">
                  {`${process.env.NEXT_PUBLIC_BASE_URL} / ${item.slug}`}
                </div>
                <h2 className="text-blue-700 text-xl capitalize font-medium">
                  {item.word}
                </h2>
                <div className="text-sm">
                  {item.definition
                    ? item.definition
                    : "pas encore de definition"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Synonyme;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = (await supabase
    .from("_word")
    .select("*")) as PostgrestSingleResponse<IParams[]>;
  const paths = data!.map((item) => {
    return {
      params: { slug: item.slug },
    };
  });
  return { fallback: "blocking", paths };
};

export const getStaticProps: GetStaticProps<{
  word: IParams | null;
}> = async (context) => {
  const { data: word } = await supabase
    .from("_word")
    .select(`*, synonymes:_synonyme!word_id(item:synm_id(*))`)
    .eq("slug", `${context.params?.slug}`)
    .single();
  return { props: { word }, revalidate: 10000 };
};
