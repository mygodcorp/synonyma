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
import { Fragment, useCallback, useEffect } from "react";
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

interface WordSectionProps {
  title: string;
  word: string;
  items: Array<{ item: IParams }>;
  isLoading: boolean;
  loaderCount?: number;
}

const WordSection = ({
  title,
  word,
  items,
  isLoading,
  loaderCount = 5,
}: WordSectionProps) => (
  <Box as="article" role="region" aria-label={`${title} de ${word}`}>
    <LineBar strong={2} />
    <Box as="header">
      <Grid.Root columns={3} align="start">
        <Grid.Item start={1}>
          <Text as="h2" size="xs" transform="uppercase" weight="bold">
            {`${title} de ${word}`}
          </Text>
        </Grid.Item>
        <Grid.Item start={2}>
          <Text as="p" size="xs" transform="uppercase" weight="bold">
            {word} ({items?.length || 0})
          </Text>
        </Grid.Item>
        <Grid.Item start={3} justify="end">
          <Text as="span" size="xs" transform="uppercase" weight="bold" aria-hidden="true">
            ●
          </Text>
        </Grid.Item>
      </Grid.Root>
    </Box>
    <Spacer space="MD" />
    {isLoading ? (
      Array.from({ length: loaderCount }).map((_, idx) => <WordLoader key={idx} />)
    ) : (
      <List
        items={items}
        renderItem={(wordItem, idx) => (
          <Fragment key={idx}>
            <WordRow word={wordItem.item.word} />
          </Fragment>
        )}
      />
    )}
  </Box>
);

export default function WordClient({ word }: PageProps) {
  const queryClient = useQueryClient();

  const { data } = useQuery<IParams>({
    queryKey: ["word", word],
    queryFn: () => getPageClient(word),
  });

  const refetchWord = useCallback(() => {
    queryClient.refetchQueries({ queryKey: ["word", word] });
  }, [queryClient, word]);

  const { isPending: isLoadingSynonymes, mutate: mutateSynonymes } = useMutation({
    mutationFn: getSynonymes,
    onSuccess: refetchWord,
  });

  const { isPending: isLoadingAntonymes, mutate: mutateAntonymes } = useMutation({
    mutationFn: getAntonymes,
    onSuccess: refetchWord,
  });

  const { isPending: isLoadingDefinition, mutate: mutateDefinition } = useMutation({
    mutationFn: getDefinition,
    onSuccess: refetchWord,
  });

  useEffect(() => {
    if (data) {
      if (!data.antonyme_processed) mutateAntonymes(word);
      if (!data.synonyme_processed) mutateSynonymes(word);
      if (!data.definition_processed) mutateDefinition(word);
    }
  }, [data, word, mutateAntonymes, mutateSynonymes, mutateDefinition]);

  return (
    <Container as="main" py="PY-MD" px="PX-MD">
      <Spacer space="MD" />
      <Text as="h1" size="large" weight="bold" transform="capitalize">
        {data?.word}
      </Text>
      <Spacer space="MD" />

      <Box as="article" role="region" aria-label={`Définition de ${data?.word}`}>
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
                aria-hidden="true"
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
      <WordSection
        title="synonymes"
        word={data?.word || ""}
        items={data?.synonymes || []}
        isLoading={isLoadingSynonymes}
      />

      <Spacer space="XL" />
      <WordSection
        title="antonymes"
        word={data?.word || ""}
        items={data?.antonymes || []}
        isLoading={isLoadingAntonymes}
        loaderCount={3}
      />
    </Container>
  );
}
