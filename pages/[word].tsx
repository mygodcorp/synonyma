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
import getPage from "lib/supabase/queries/get-page-data";
import getSynonymes from "utils/data/get-synonymes";
import getPageClient from "utils/data/get-page-client";
import getAntonymes from "utils/data/get-antonymes";
import { Box } from "components/box";
import { Text } from "components/text/text";
import { Spacer } from "components/spacer/spacer";
import { Container } from "components/container/container.stories";
import { List } from "components/list";
import { Fragment, useEffect, useRef } from "react";
import * as Grid from "components/grid";
import { LineBar } from "components/line-bar/line-bar";
import { WordRow } from "components/word-row/word-row";
import { WordLoader } from "components/word-loader/word-loader";
import getDefinition from "utils/data/get-definition";
import { Skeleton } from "components/skeleton/skeleton";

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
  const ref = useRef();

  const { data } = useQuery<IParams>({
    queryKey: ["word", props.word],
    queryFn: () => getPageClient(props.word),
  });

  const { isLoading: isLoadingSynonymes, mutate: mutateSynonymes } =
    useMutation({
      mutationFn: getSynonymes,
      onSuccess: () => {
        queryClient.refetchQueries(["word", props.word]);
      },
    });

  const { isLoading: isLoadingAntonymes, mutate: mutateAntonymes } =
    useMutation({
      mutationFn: getAntonymes,
      onSuccess: () => {
        queryClient.refetchQueries(["word", props.word]);
      },
    });

  const { isLoading: isLoadingDefinition, mutate: mutateDefinition } =
    useMutation({
      mutationFn: getDefinition,
      onSuccess: () => {
        queryClient.refetchQueries(["word", props.word]);
      },
    });

  useEffect(() => {
    if (!data?.antonyme_processed) {
      mutateAntonymes(props.word);
    }
    if (!data?.synonyme_processed) {
      mutateSynonymes(props.word);
    }
    if (!data?.definition_processed) {
      mutateDefinition(props.word);
    }
  }, [props.word]);

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
      <Container as="main" py="PY-MD">
        <Spacer space="MD" />
        <Text as="h1" size="XXL" transform="capitalize">
          {data?.word}
        </Text>
        <Spacer space="MD" />
        <Box as="article">
          <LineBar strong={2} />
          <Box as="header">
            <Grid.Root columns={3} align="start">
              <Grid.Item start={1}>
                <Text as="h2" size="XS">
                  {`Définition de ${data?.word}`}
                </Text>
              </Grid.Item>
              <Grid.Item start={3} justify="end">
                <Text as="span" size="XS">
                  ●
                </Text>
              </Grid.Item>
            </Grid.Root>
          </Box>
          <Spacer space="MD" />
          {isLoadingDefinition ? (
            <Skeleton w={200} />
          ) : (
            <Text as="p" size="L">
              {data?.definition}
            </Text>
          )}
        </Box>
        <Spacer space="XL" />
        <Box as="article">
          <LineBar strong={2} />
          <Box as="header">
            <Grid.Root columns={3} align="start">
              <Grid.Item start={1}>
                <Text as="h2" size="XS">
                  {`synonymes de ${data?.word}`}
                </Text>
              </Grid.Item>
              <Grid.Item start={2}>
                <Text as="p" size="XS">
                  {data?.word} ({data?.synonymes.length})
                </Text>
              </Grid.Item>
              <Grid.Item start={3} justify="end">
                <Text as="span" size="XS">
                  ●
                </Text>
              </Grid.Item>
            </Grid.Root>
          </Box>
          <Spacer space="MD" />
          {isLoadingSynonymes ? (
            Array.from(Array(5)).map((_, idx) => <WordLoader key={idx} />)
          ) : (
            <List
              items={data!.synonymes}
              renderItem={(word, idx) => (
                <Fragment key={idx}>
                  <WordRow word={word.item.word} />
                </Fragment>
              )}
            />
          )}
        </Box>
        <Spacer space="XL" />
        <Box as="article">
          <LineBar strong={2} />
          <Box as="header">
            <Grid.Root columns={3} align="start">
              <Grid.Item start={1}>
                <Text as="h2" size="XS">
                  {`antonymes de ${data?.word}`}
                </Text>
              </Grid.Item>
              <Grid.Item start={2}>
                <Text as="p" size="XS">
                  {data?.word} ({data?.antonymes.length})
                </Text>
              </Grid.Item>
              <Grid.Item start={3} justify="end">
                <Text as="span" size="XS">
                  ●
                </Text>
              </Grid.Item>
            </Grid.Root>
          </Box>
          <Spacer space="MD" />
          {isLoadingAntonymes ? (
            Array.from(Array(3)).map((_, idx) => <WordLoader key={idx} />)
          ) : (
            <List
              items={data!.antonymes}
              renderItem={(word, idx) => (
                <Fragment key={idx}>
                  <WordRow word={word.item.word} />
                </Fragment>
              )}
            />
          )}
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
