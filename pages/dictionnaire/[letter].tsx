import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Container } from "components/container/container.stories";
import * as Grid from "components/grid";
import { LineBar } from "components/line-bar/line-bar";
import { List } from "components/list";
import { Spacer } from "components/spacer/spacer";
import { Text } from "components/text/text";
import { WordRow } from "components/word-row/word-row";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import getDictionary from "lib/supabase/queries/get-dictionary";
import getDictionaryClient from "utils/data/get-dictionary-client";
import { Box } from "components/box";
import { WordLoader } from "components/word-loader/word-loader";

type PageProps = {
  letter: string;
};

function Dictionnaire(props: PageProps) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      refetchOnWindowFocus: false,
      queryKey: ["words", props.letter],
      queryFn: (params) => getDictionaryClient(props.letter, params.pageParam),
      getNextPageParam: (lastPage) => {
        return lastPage?.total < lastPage?.size ? undefined : lastPage?.page;
      },
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (!data?.pages) return null;
  return (
    <Fragment>
      <NextSeo
        title={`Lettre ${props.letter.toUpperCase()} : Mots et Synonymes qui commencent par la lettre ${props.letter.toUpperCase()}`}
        description={`Synonymes des mots de la lettre ${props.letter.toUpperCase()} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`}
        defaultTitle={`Mots et synonymes qui commencent par la lettre ${props.letter.toUpperCase()}`}
        canonical={`https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/dictionnaire/${props.letter}`}
        openGraph={{
          title: `Lettre ${props.letter.toUpperCase()} : Mots et Synonymes qui commencent par la lettre ${props.letter.toUpperCase()}`,
          type: "article",
          images: [
            {
              url: `https://${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/image/og?word=${props.letter}`,
            },
          ],
          description: `Synonymes des mots de la lettre ${props.letter.toUpperCase()} par Synonyma.fr, la principale source en ligne de synonymes, d'antonymes, et plus encore.`,
        }}
      />
      <Container as="main" py="PY-MD">
        <Spacer space="MD" />
        <Text as="h1" size="XXL" transform="capitalize">
          {props.letter.toUpperCase()}
        </Text>
        <Spacer space="MD" />
        <LineBar strong={2} />
        <Grid.Root columns={3} align="start">
          <Grid.Item start={1}>
            <Text as="h2" size="XS">
              {`mots en ${props.letter.toUpperCase()}`}
            </Text>
          </Grid.Item>
          <Grid.Item start={2}>
            <Text as="p" size="XS">
              {`(${data.pages.length})`}
            </Text>
          </Grid.Item>
          <Grid.Item start={3} justify="end">
            <Text as="span" size="XS">
              ●
            </Text>
          </Grid.Item>
        </Grid.Root>
        <Spacer space="MD" />
        <List
          items={data?.pages}
          renderItem={(data, idx) => (
            <List
              key={idx}
              items={data!.data}
              renderItem={(word, idx) => (
                <Fragment key={idx}>
                  <WordRow word={word?.word} />
                </Fragment>
              )}
            ></List>
          )}
        />

        <Box ref={ref} />

        {isFetchingNextPage ? (
          Array.from(Array(20)).map((item) => <WordLoader key={item} />)
        ) : hasNextPage ? (
          Array.from(Array(20)).map((item) => <WordLoader key={item} />)
        ) : (
          <span>End</span>
        )}
      </Container>
    </Fragment>
  );
}

export default Dictionnaire;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ].map((item) => {
    return {
      params: { letter: item.toLocaleLowerCase() },
    };
  });
  return { fallback: false, paths };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["words", context.params?.letter],
      queryFn: () => getDictionary(context.params?.letter as string, 0),
      getNextPageParam: (lastPage) => {
        return lastPage.page;
      },
    });
    return {
      props: {
        letter: context.params?.letter,
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
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
