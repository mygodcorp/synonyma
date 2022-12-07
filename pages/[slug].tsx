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
        <h1 className="mb-1">
          <span className="text-xs font-bold text-neutral-500 hidden">
            Synonymes de
          </span>
          <span className="text-6xl font-bold capitalize text-neutral-800 tracking-tighter">
            {data?.word}
          </span>
        </h1>
        <p className="text-xl text-neutral-700">{data?.definition}</p>
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
