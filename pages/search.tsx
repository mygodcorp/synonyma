import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { useCallback, useEffect, useState } from "react";

interface IParams extends ParsedUrlQueryInput {
  created_at: string;
  word: string;
  synonyme_processed: false;
  definition: string | null;
  slug: string;
  id: string;
  definition_processed: false;
}

async function textSearch(word: string): Promise<IParams[] | null> {
  const { data } = (await supabase
    .from("_word")
    .select("*")
    .like("word", `${word}%`)
    .order("word", { ascending: true })) as PostgrestSingleResponse<IParams[]>;
  return data;
}

function Recherche() {
  const [result, setResult] = useState<IParams[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!router.query.q) return;
    textSearch(router.query.q as string).then((data) => {
      if (!data) return;
      setResult(data);
    });
    return () => setResult();
  }, [router.query.q]);

  console.log(result);

  return (
    <>
      <NextSeo
        title="Mots qui commencent par a"
        description="mots qui commencent par a"
      />
      <div className="mx-auto">
        <div className="grid items-center h-screen p-6">
          <div className="flex justify-center flex-col">
            {result.map((prop) => (
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

export default Recherche;
