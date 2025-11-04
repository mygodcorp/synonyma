"use client";

import {
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Container } from "components/container/container";
import * as Grid from "components/grid";
import { LineBar } from "components/line-bar/line-bar";
import { List } from "components/list";
import { Spacer } from "components/spacer/spacer";
import { Text } from "components/text/text";
import { WordRow } from "components/word-row/word-row";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import getDictionaryClient from "utils/data/get-dictionary-client";
import { Box } from "components/box";
import { WordLoader } from "components/word-loader/word-loader";

type PageProps = {
  letter: string;
};

export default function DictionaryClient(props: PageProps) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      refetchOnWindowFocus: false,
      queryKey: ["words", props.letter],
      queryFn: (params) => getDictionaryClient(props.letter, params.pageParam),
      initialPageParam: 0,
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
    <Container as="main" py="PY-MD" px="PX-MD">
      <Spacer space="MD" />
      <Text as="h1" size="xlarge" transform="capitalize">
        {props.letter.toUpperCase()}
      </Text>
      <Spacer space="MD" />
      <LineBar strong={2} />
      <Grid.Root columns={3} align="start">
        <Grid.Item start={1}>
          <Text as="h2" size="xs">
            {`mots en ${props.letter.toUpperCase()}`}
          </Text>
        </Grid.Item>
        <Grid.Item start={2}>
          <Text as="p" size="xs">
            {`(${data.pages.length})`}
          </Text>
        </Grid.Item>
        <Grid.Item start={3} justify="end">
          <Text as="span" size="xs">
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
          />
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
  );
}
