import { supabase } from "lib/supabase";
import Head from "next/head";
import Link from "next/link";
import slugify from "slugify";

export const dynamicParams = true;

type SynonymT = {
  id: string;
  mot: string;
  definition: string;
  synonymes: Array<string>;
  antonymes: Array<string>;
  familiers: Array<string>;
};

async function getData(id: string): Promise<SynonymT> {
  const { data, error } = await supabase
    .from("mots")
    .select("*")
    .eq("mot", id)
    .single();
  if (!data) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ask/${id}`
    );
    const data = await res.json();
    return data;
  }
  return data;
}

export default async function Page({ params }: { params: { id: string } }) {
  const props = await getData(decodeURIComponent(params.id));
  return (
    <>
      <title>{`Synonymes de ${props.mot}`}</title>
      <meta
        name="description"
        content={`Tous les synonymes de ${props.mot}`}
      ></meta>
      <article className="prose lg:prose-xl">
        <h1 className="font-normal">
          Synonymes de <span className="font-bold">{props.mot}</span>
        </h1>
        <hr />
        <h2 className="font-normal">
          Définition de <span className="font-bold">{props.mot}</span>
        </h2>
        <p>{props.definition}</p>
        <hr />
        <h2 className="font-normal">
          Synonymes de <span className="font-bold">{props.mot}</span>
        </h2>
        <ul>
          {props.synonymes.map((synonyme: string) => (
            <li key={synonyme}>
              <a href={synonyme}>{synonyme}</a>
            </li>
          ))}
        </ul>
        <hr />
        <h2 className="font-normal">
          Antonymes de <span className="font-bold">{props.mot}</span>
        </h2>
        <ul>
          {props.antonymes.map((synonyme: string) => (
            <li key={synonyme}>
              <a href={synonyme}>{synonyme}</a>
            </li>
          ))}
        </ul>
        <hr />
        <h2 className="font-normal">
          Synonymes familiers de <span className="font-bold">{props.mot}</span>
        </h2>
        <ul>
          {props.familiers?.map((synonyme: string) => (
            <li key={synonyme}>
              <a href={synonyme}>{synonyme}</a>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
