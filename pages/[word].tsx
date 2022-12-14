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
import { Scramble } from "components/scramble";
import { Box } from "components/box";
import { MetaBar } from "components/meta-bar/meta-bar";
import { Text } from "components/text/text";
import { Spacer } from "components/spacer/spacer";
import { Container } from "components/container/container.stories";

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
      <Container as="main">
        <Text as="h1" size="XXL" transform="capitalize">
          {data?.word}
        </Text>
        <Spacer space="MD" />
        <Box as="article">
          <MetaBar label="description" symbol="♥" />
          <Spacer space="MD" />
          <Text as="p" size="L">
            {data?.definition}
          </Text>
        </Box>
      </Container>
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
