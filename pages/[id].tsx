import { supabase } from "lib/supabase";
import {
  GetStaticProps,
  GetStaticPaths,
  GetServerSideProps,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { SyntheticEvent, useRef } from "react";

type SynonymT = {
  id: string;
  mot: string;
  definition: string;
  synonymes: Array<string>;
};

async function word(word: string) {
  const res = await fetch(`http://localhost:3001/api/ask/${word}`);
  const data = await res.json();
  return data;
}

function Synonym(props: SynonymT) {
  const ref = useRef<HTMLAnchorElement>(null);
  if (!props) return <p>No profile data</p>;
  return (
    <div>
      <article className="prose lg:prose-xl">
        <h1 className="font-normal">
          Synonymes de <span className="font-bold">{props.mot}</span>
        </h1>
        <p>{props.definition}</p>
        <ul>
          {props.synonymes.map((synonyme) => (
            <li key={synonyme}>
              <a ref={ref} href={synonyme}>
                {synonyme}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps<{
  synonyme: SynonymT[] | null;
}> = async (context) => {
  const { data, error } = await supabase
    .from("mots")
    .select("*")
    .eq("mot", context.params?.id)
    .single();
  return {
    props: data,
    revalidate: 10, // In seconds
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const { data } = await supabase.from("mots").select("*");
  // Get the paths we want to pre-render based on posts
  const paths = data?.map((synonym) => ({
    params: { id: synonym.mot },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export default Synonym;
