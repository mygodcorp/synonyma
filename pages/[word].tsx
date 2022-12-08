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
import getPageClient from "utils/data/get-page-client";
import getAntonymes from "utils/data/get-antonymes";

interface IParams {
  created_at: string;
  word: string;
  synonyme_processed: boolean;
  antonyme_processed: boolean;
  definition: string | null;
  slug: string;
  id: string;
  definition_processed: false;
  synonymes: Array<{ item: IParams }>;
  antonymes: Array<{ item: IParams }>;
}

type PageProps = {
  word: string;
};

function Synonyme(props: PageProps) {
  const queryClient = useQueryClient();
  const { data } = useQuery<IParams>({
    queryKey: ["word", props.word],
    queryFn: () => getPageClient(props.word),
  });

  const synonymes = useMutation({
    mutationFn: getSynonymes,
    onSuccess: () => {
      queryClient.refetchQueries(["word", props.word]);
    },
  });

  const antonymes = useMutation({
    mutationFn: getAntonymes,
    onSuccess: () => {
      queryClient.refetchQueries(["word", props.word]);
    },
  });

  return (
    <>
      <NextSeo
        title={`${data?.word.toUpperCase()} Synonymes: Synonymes & Antonymes de ${data?.word.toUpperCase()}`}
        description={`Synonymes de ${data?.word} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`}
        defaultTitle={data?.word.toUpperCase()}
        canonical={`https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/${data?.word}`}
        openGraph={{
          title: `${
            data?.word
          } Synonymes: Synonymes & Antonymes de ${data?.word.toUpperCase()}`,
          type: "article",
          images: [
            {
              url: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/image/og?word=${props.word}`,
            },
          ],
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
                    onClick={() => synonymes.mutate(props.word)}
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
                    href={synonyme.item.word}
                  >
                    {synonyme.item.word}
                  </Link>
                  <Link className="text-neutral-500" href={synonyme.item.word}>
                    Synonymes de {synonyme.item.word}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-8">
            <h2 className="text-1xl lg:text-3xl font-bold text-neutral-800 pb-3">
              <span>Antonymes de </span>
              <span className="capitalize">{data?.word}</span>
            </h2>
            <ul className="divide-y divide-dashed">
              {!data?.antonyme_processed && (
                <div className="bg-neutral-200 p-8 flex justify-center items-center mt-6">
                  <button
                    onClick={() => antonymes.mutate(props.word)}
                    className="relative bg-neutral-900 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 text-sm text-white font-semibold h-12 px-6 rounded-lg flex items-center dark:bg-neutral-700 dark:hover:bg-neutral-600 pointer-events-auto"
                  >
                    {antonymes.isLoading
                      ? "Chargement..."
                      : "Voir les antonymes"}
                  </button>
                </div>
              )}
              {data?.antonymes.map((antonyme) => (
                <li key={antonyme.item.id} className="py-6">
                  <Link
                    className="block capitalize font-semibold"
                    href={antonyme.item.word}
                  >
                    {antonyme.item.word}
                  </Link>
                  <Link className="text-neutral-500" href={antonyme.item.word}>
                    Antonymes de {antonyme.item.word}
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
      params: { word: item.word },
    };
  });
  return { fallback: "blocking", paths };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: ["word", context.params?.word],
      queryFn: () => getPage(context.params?.word as string),
    });
    return {
      props: {
        word: context.params?.word,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 10000,
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
