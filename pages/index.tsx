import { Box } from "components/box";
import { useState, useRef, useEffect, Fragment } from "react";
import getSearch from "utils/data/get-search";
import { useRouter } from "next/router";
import Fuse from "fuse.js";
import { MetaBar } from "components/meta-bar/meta-bar";
import { Spacer } from "components/spacer/spacer";
import { Text } from "components/text/text";
import styles from "styles/home.module.css";
import { Container } from "components/container/container";
import { LineBar } from "components/line-bar/line-bar";
import * as Grid from "components/grid";
import { WordRow } from "components/word-row/word-row";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import getWord from "lib/supabase/queries/get-word";
import { GetStaticProps } from "next";
import getMostSearchedWord from "lib/supabase/queries/get-most-searched";
import { List } from "components/list";

type PageProps = {
  limit: number;
};

function Home(props: PageProps) {
  const { data } = useQuery<IParams[]>({
    queryKey: ["homepage"],
    queryFn: () => getMostSearchedWord(props.limit),
  });

  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const [suggestions, setSuggestions] =
    useState<Fuse.FuseResult<{ word: string; id: string }>[]>();
  const [suggestionsActive, setSuggestionsActive] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  const onChange = async (
    event: React.FormEvent<HTMLInputElement>
  ): Promise<void> => {
    setValue(event.currentTarget.value.toLocaleLowerCase());
    const data = getSearch(event.currentTarget.value.toLocaleLowerCase());
    setSuggestionsActive(true);
    setSuggestions(data);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLLIElement>,
    word: string
  ) => {
    event.preventDefault();
    router.push(word);
    setValue(event.currentTarget.innerText);
    setSuggestions([]);
    setSuggestionsActive(false);
  };

  const Suggestions = () => {
    return (
      <Box
        as="ul"
        className="absolute border-neutral-400 w-full mt-2 space-y-1 "
      >
        {suggestions?.map(({ item }) => (
          <Box
            onClick={(e: React.MouseEvent<HTMLLIElement>) =>
              handleClick(e, item.word)
            }
            key={item.id}
            as="li"
            className=" bg-neutral-50 p-2 rounded-lg cursor-pointer"
          >
            {item.word}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box as="main" className="max-w-8xl mx-auto py-4 px-4">
      <Box as="article" className="items-center h-[calc(50vh-6rem)] flex">
        <Box as="section" className="max-w-xl mx-auto flex-1 relative">
          <Box
            ref={ref}
            value={value}
            onChange={onChange}
            name="search"
            type="text"
            autoComplete="off"
            as="input"
            placeholder="Que recherchez-vous comme synonymes ?"
            className="w-full bg-transparent font-normal focus:bg-neutral-200 focus:pl-4 py-3 transition-all focus:rounded-lg flex-1 text-neutral-800 placeholder:text-neutral-600 border-b outline-none border-neutral-200"
          />
          {suggestionsActive && suggestions?.length ? <Suggestions /> : null}
        </Box>
      </Box>

      <Box as="article">
        <LineBar strong={2} />
        <Box as="header">
          <Grid.Root columns={3} align="start">
            <Grid.Item start={1}>
              <Text as="h2" size="XS">
                Synonymes les plus recherchés
              </Text>
            </Grid.Item>
            <Grid.Item start={2}>
              <Text as="p" size="XS">
                ●
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
        {data && (
          <List
            items={data}
            renderItem={(item, idx) => (
              <Fragment key={idx}>
                <WordRow word={item.word} />
              </Fragment>
            )}
          />
        )}
      </Box>
      <Spacer space="XL" />
      <Container py="PY-XXL">
        <MetaBar label="Synonyma.fr" symbol=" ●" />
        <Spacer space="MD" />
        <Box as="div" className={styles.root}>
          <Text as="p" size="L" transform="capitalize" className={styles.title}>
            Synonyma®
          </Text>
          <Text as="p" size="S" className={styles.description}>
            Nous avons rassemblé une liste de synonymes pour des centaines de
            mots courants et spécialisés, afin de vous aider à trouver le mot
            juste pour chaque occasion. Notre base de données est mise à jour
            régulièrement. N'hésitez pas à nous faire part de vos commentaires
            ou suggestions pour améliorer notre site. Bonne utilisation de
            Synonyma.fr !
          </Text>
        </Box>
      </Container>
      <Spacer space="XL" />
    </Box>
  );
}

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: ["homepage"],
      queryFn: () => getMostSearchedWord(10),
    });
    return {
      props: {
        limit: 10,
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
