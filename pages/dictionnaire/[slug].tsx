import { Container } from "components/container/container.stories";
import * as Grid from "components/grid";
import { LineBar } from "components/line-bar/line-bar";
import { List } from "components/list";
import { Spacer } from "components/spacer/spacer";
import { Text } from "components/text/text";
import { WordRow } from "components/word-row/word-row";
import { supabase } from "lib/supabase/supabase";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { ParsedUrlQueryInput } from "querystring";
import { Fragment } from "react";

interface IParams extends ParsedUrlQueryInput {
  created_at: string;
  word: string;
  synonyme_processed: false;
  definition: string | null;
  slug: string;
  id: string;
  definition_processed: false;
}

function Dictionnaire(props: { words: IParams[]; letter: string }) {
  return (
    <>
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
              {`(${props.words.length})`}
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
          items={props.words}
          renderItem={(word, idx) => (
            <Fragment key={idx}>
              <WordRow word={word.word} />
            </Fragment>
          )}
        />
      </Container>
    </>
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
      params: { slug: item.toLocaleLowerCase() },
    };
  });
  return { fallback: false, paths };
};

export const getStaticProps: GetStaticProps<{
  words: IParams[] | null;
}> = async (context) => {
  const { data: words } = await supabase
    .from("_word")
    .select("*")
    .limit(10)
    .like("word", `${context.params?.slug as string}%`)
    .order("word", { ascending: true });
  return { props: { words, letter: context.params?.slug }, revalidate: 10000 };
};
