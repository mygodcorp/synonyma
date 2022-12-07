import { PostgrestSingleResponse } from "@supabase/supabase-js";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "lib/supabase/supabase";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import getPage from "lib/supabase/queries/get-page-data";
import getSynonymes from "utils/data/get-synonymes";
import getDefinition from "utils/data/get-definition";

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

type PageProps = {
  slug: string;
};

function Synonyme(props: PageProps) {
  const queryClient = useQueryClient();
  const { data } = useQuery<IParams>({
    queryKey: ["word", props.slug],
    queryFn: () => getPage(props.slug),
  });

  const synonymes = useMutation({
    mutationFn: getSynonymes,
    onSuccess: () => {
      queryClient.refetchQueries(["word", props.slug]);
    },
  });

  const defintion = useMutation({
    mutationFn: getDefinition,
    onSuccess: () => {
      queryClient.refetchQueries(["word", props.slug]);
    },
  });

  return (
    <>
      <NextSeo
        title={`${data?.word.toUpperCase()} Synonymes: Synonymes & Antonymes de ${data?.word.toUpperCase()}`}
        description={`Synonymes de ${data?.word} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`}
        defaultTitle={data?.word.toUpperCase()}
        canonical={`https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/${data?.slug}`}
        openGraph={{
          title: `${
            data?.word
          } Synonymes: Synonymes & Antonymes de ${data?.word.toUpperCase()}`,
          type: "article",
          description: `Synonymes de ${data?.word.toUpperCase()} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`,
        }}
      />
      <main className="max-w-2xl mx-auto">
        <article className="mt-8 px-4">
          <header>
            <h1 className="mb-2">
              <span className="text-xs font-bold text-neutral-500 hidden">
                Synonymes de
              </span>
              <span className="text-3xl lg:text-6xl font-bold capitalize text-neutral-800">
                {data?.word}
              </span>
            </h1>
            <p className="text-xl text-neutral-700">{data?.definition}</p>
          </header>
          <section className="mt-8">
            <h2 className="text-1xl lg:text-3xl font-bold text-neutral-800 pb-3">
              <span>Synonymes de </span>
              <span className="capitalize">{data?.word}</span>
            </h2>
            <ul className="divide-y divide-dashed">
              {!data?.synonyme_processed && (
                <div className="bg-neutral-200 p-8 flex justify-center items-center mt-6">
                  <button
                    onClick={() => synonymes.mutate(props.slug)}
                    className="relative bg-neutral-900 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 text-sm text-white font-semibold h-12 px-6 rounded-lg flex items-center dark:bg-neutral-700 dark:hover:bg-neutral-600 pointer-events-auto"
                  >
                    {synonymes.isLoading
                      ? "Chargement..."
                      : "Voir les synonymes"}
                  </button>
                </div>
              )}
              {data?.synonymes.map((synonyme) => (
                <li key={synonyme.item.id} className="py-6">
                  <Link
                    className="block capitalize font-semibold"
                    href={synonyme.item.slug}
                  >
                    {synonyme.item.word}
                  </Link>
                  <Link className="text-neutral-500" href={synonyme.item.slug}>
                    Synonymes de {synonyme.item.word}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>
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

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["word", context.params?.slug],
    queryFn: () => getPage(context.params?.slug as string),
  });
  return {
    props: {
      slug: context.params?.slug,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10000,
  };
};
