import { Box } from "components/box";
import { useState, useRef, useEffect, useCallback } from "react";
import { animate } from "motion";
import getSearch from "utils/data/get-search";
import { useRouter } from "next/router";
import Link from "next/link";

function Home() {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Array<IParams>>();
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestionsActive, setSuggestionsActive] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  const onChange = (event: React.FormEvent<HTMLInputElement>): void => {
    setValue(event.currentTarget.value.toLocaleLowerCase());
    if (suggestions?.length) {
      setSuggestionsActive(true);
    } else {
      setSuggestionsActive(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (!value) return;
      const { data } = await getSearch(value);
      setSuggestions(data);
    };
    fetch().catch(console.error);
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setSuggestions([]);
    setSuggestionsActive(false);
    setValue("");
  };

  const handleBlur = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSuggestions([]);
    setSuggestionsActive(false);
    setValue("");
  };

  const Suggestions = () => {
    return (
      <Box
        as="ul"
        className="absolute border-neutral-400 w-full mt-2 space-y-1 "
      >
        {suggestions?.map((item) => (
          <Box key={item.id} as="li" className=" bg-neutral-50 p-2 rounded-lg">
            <Link href={`/${item.slug}`}>{item.word}</Link>
          </Box>
        ))}
      </Box>
    );
  };

  console.log(JSON.stringify(suggestions));

  return (
    <Box as="main" className="max-w-8xl mx-auto bg-white py-4 px-4">
      <Box as="article" className="items-center h-[calc(50vh-6rem)] flex">
        <Box as="section" className="max-w-xl mx-auto flex-1 relative">
          <Box
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            name="search"
            type="text"
            autoComplete="off"
            as="input"
            placeholder="Que recherchez-vous comme synonymes ?"
            className="w-full font-normal focus:bg-neutral-200 focus:pl-4 py-3 transition-all focus:rounded-lg flex-1 text-neutral-800 placeholder:text-neutral-600 border-b outline-none border-neutral-200"
          />
          {suggestionsActive && suggestions?.length ? <Suggestions /> : null}
        </Box>
      </Box>
    </Box>
  );
}

export default Home;

//*
