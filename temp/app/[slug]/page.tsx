import { supabase } from "lib/supabase/supabase";
import Head from "next/head";
import Link from "next/link";
import slugify from "slugify";

export const dynamicParams = true;

type SynonymT = {
  id: string;
  word: string;
  definition: string;
  slug: string;
  synonymes: Array<string>;
  antonymes: Array<string>;
  familiers: Array<string>;
};

async function getData(slug: string): Promise<SynonymT> {
  const { data, error } = await supabase
    .from("_word")
    .select(`*, synonymes:_synonyme!word_id(item:synm_id(*))`)
    .eq("slug", slug)
    .single();
  return data;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const props = await getData(decodeURIComponent(params.slug));
  return (
    <>
      <title>{`Synonymes de ${props.word}`}</title>
      <meta
        name="description"
        content={`Tous les synonymes de ${props.word}`}
      ></meta>
      <article className="prose lg:prose-xl">
        <h1 className="font-normal">
          Synonymes de <span className="font-bold">{props.word}</span>
        </h1>
        <hr />
        <h2 className="font-normal">
          Définition de <span className="font-bold">{props.word}</span>
        </h2>
        <p>{props.definition}</p>
        <hr />
        <h2 className="font-normal">
          Synonymes de <span className="font-bold">{props.word}</span>
        </h2>
        <ul>
          {props.synonymes.map((synonyme: any) => (
            <li key={synonyme.item.id}>
              <a href={synonyme.item.slug}>{synonyme.item.word}</a>
            </li>
          ))}
        </ul>
        <hr />
      </article>
    </>
  );
}
