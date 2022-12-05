import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "lib/supabase";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { useCallback, useEffect, useState } from "react";

async function search(word: string): Promise<IParams[]> {
  const res = await fetch(`/api/search?q=${word}`);
  const data = await res.json();
  return data;
}

function Recherche() {
  const [result, setResult] = useState<IParams[]>([]);
  const router = useRouter();

  useEffect(() => {
    search(router.query.q as string)
      .then((data) => {
        setResult(data);
      })
      .catch((error) => router.push("/"));
    return () => setResult([]);
  }, [router.query.q]);

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
