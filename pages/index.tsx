import { Box } from "components/box";
import { useState, useRef, useEffect } from "react";
import getSearch from "utils/data/get-search";
import { useRouter } from "next/router";
import Fuse from "fuse.js";
import { MetaBar } from "components/meta-bar/meta-bar";
import { Spacer } from "components/spacer/spacer";
import { Text } from "components/text/text";
import styles from "styles/home.module.css";

function Home() {
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
      <Box>
        <MetaBar label="Synonyma.fr" symbol="?" />
        <Spacer space="MD" />
        <Box as="div" className={styles.root}>
          <Text
            as="h2"
            size="L"
            transform="capitalize"
            className={styles.title}
          >
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
      </Box>
    </Box>
  );
}

export default Home;

//*
