"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import getPageClient from "utils/data/get-page-client";
import getSynonymes from "utils/data/get-synonymes";
import getAntonymes from "utils/data/get-antonymes";
import { Box } from "components/box";
import { Text } from "components/text/text";
import { Spacer } from "components/spacer/spacer";
import { Container } from "components/container/container";
import { List } from "components/list";
import { Fragment, useEffect } from "react";
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

export default function WordClient(props: PageProps) {
  const queryClient = useQueryClient();

  const { data } = useQuery<IParams>({
    queryKey: ["word", props.word],
    queryFn: () => getPageClient(props.word),
  });

  const { isPending: isLoadingSynonymes, mutate: mutateSynonymes } =
    useMutation({
      mutationFn: getSynonymes,
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["word", props.word] });
      },
    });

  const { isPending: isLoadingAntonymes, mutate: mutateAntonymes } =
    useMutation({
      mutationFn: getAntonymes,
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["word", props.word] });
      },
    });

  const { isPending: isLoadingDefinition, mutate: mutateDefinition } =
    useMutation({
      mutationFn: getDefinition,
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["word", props.word] });
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
  }, [mutateAntonymes, mutateSynonymes, mutateDefinition, data, props.word]);

  return (
    <Container as="main" py="PY-MD" px="PX-MD">
      <Spacer space="MD" />
      <Text as="h1" size="large" weight="bold" transform="capitalize">
        {data?.word}
      </Text>
      <Spacer space="MD" />
      <Box as="article">
        <LineBar strong={2} />
        <Box as="header">
          <Grid.Root columns={3} align="start">
            <Grid.Item start={1}>
              <Text as="h2" size="small" transform="uppercase" weight="bold">
                {`Définition de ${data?.word}`}
              </Text>
            </Grid.Item>
            <Grid.Item start={3} justify="end">
              <Text
                as="span"
                size="small"
                transform="uppercase"
                weight="bold"
              >
                ●
              </Text>
            </Grid.Item>
          </Grid.Root>
        </Box>
        <Spacer space="MD" />
        {isLoadingDefinition ? (
          <Skeleton w={200} />
        ) : (
          <Text as="p" size="base">
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
              <Text as="h2" size="xs" transform="uppercase" weight="bold">
                {`synonymes de ${data?.word}`}
              </Text>
            </Grid.Item>
            <Grid.Item start={2}>
              <Text as="p" size="xs" transform="uppercase" weight="bold">
                {data?.word} ({data?.synonymes.length})
              </Text>
            </Grid.Item>
            <Grid.Item start={3} justify="end">
              <Text as="span" size="xs" transform="uppercase" weight="bold">
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
              <Text as="h2" size="xs" transform="uppercase" weight="bold">
                {`antonymes de ${data?.word}`}
              </Text>
            </Grid.Item>
            <Grid.Item start={2}>
              <Text as="p" size="xs" transform="uppercase" weight="bold">
                {data?.word} ({data?.antonymes.length})
              </Text>
            </Grid.Item>
            <Grid.Item start={3} justify="end">
              <Text as="span" size="xs" transform="uppercase" weight="bold">
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
  );
}
