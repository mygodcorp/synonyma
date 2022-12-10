import { Box } from "components/box";
import React, { Fragment, useRef } from "react";
import { Results } from "./results";
import Fuse from "fuse.js";
interface SearchProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
  placeholder: string;
  items: Fuse.FuseResult<{ word: string; id: string; slug: string }>[];
  suggestions: boolean;
}

function Search({
  value,
  onChange,
  onBlur,
  onClick,
  placeholder,
  items,
  suggestions,
}: SearchProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Fragment>
      <Box
        ref={ref}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name="search"
        type="search"
        autoComplete="off"
        as="input"
        placeholder={placeholder}
        className="w-full font-normal focus:bg-neutral-200 text-sm focus:pl-4 py-2 transition-all focus:rounded-lg flex-1 text-neutral-800 placeholder:text-neutral-600 border-b outline-none border-neutral-200"
      />
      {suggestions && <Results onClick={onClick} items={items} />}
    </Fragment>
  );
}

export { Search };
export type { SearchProps };
