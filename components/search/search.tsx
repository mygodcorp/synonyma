import { Box } from "components/box";
import { useRef } from "react";

interface SearchProps {
  value: string;
  onChange: () => void;
  onFocus: () => void;
  placeholder: string;
}

const Search = ({ value, onChange, onFocus, placeholder }: SearchProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Box
      ref={ref}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      name="search"
      type="search"
      autoComplete="off"
      as="input"
      placeholder={placeholder}
      className="w-full font-normal focus:bg-neutral-200 focus:pl-4 py-3 transition-all focus:rounded-lg flex-1 text-neutral-800 placeholder:text-neutral-600 border-b outline-none border-neutral-200"
    />
  );
};

export { Search };
export type { SearchProps };
