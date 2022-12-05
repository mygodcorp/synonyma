import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";

const fetcher = async (slug: string | undefined) => {
  const { data } = await supabase
    .from("_word")
    .select(`*, synonymes:_synonyme!word_id(item:synm_id(*))`)
    .eq("slug", `${slug}`)
    .single();
  return data;
};

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
        title={`${props.word.word.toUpperCase()} Synonymes: Synonymes & Antonymes de ${props.word.word.toUpperCase()}`}
        description={`Synonymes de ${props.word.word} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`}
        defaultTitle={props.word.word.toUpperCase()}
        canonical={`https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/${props.word.slug}`}
        openGraph={{
          title: `${
            props.word.word
          } Synonymes: Synonymes & Antonymes de ${props.word.word.toUpperCase()}`,
          type: "article",
          description: `Synonymes de ${props.word.word.toUpperCase()} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`,
        }}
      />
      <main className="max-w-5xl mx-auto">
        <div className="grid items-center p-6">
          <div className="prose flex justify-center flex-col">
            <h1>
              <span>Synonymes de </span>
              <span className="capitalize">{props.word.word}</span>
            </h1>
            <p>{props.word.definition}</p>
            <ul>
              {props.word.synonymes.map(({ item }) => (
                <li key={item.id}>
                  <Link
                    className="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-sm font-medium text-purple-800"
                    href={`/${item.slug}`}
                  >
                    {item.word}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
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
  const word = await fetcher(context.params?.slug as string);
  return {
    props: {
      word,
    },
    revalidate: 10000,
  };
};
