import { Box } from "components/box";
import { Fragment, useRef } from "react";

interface ResultsProps<T> {
  items: [];
  onClick: () => void;
}

function Results<T>({ items }: ResultsProps<T>) {
  return (
    <Fragment>
      {items.map((item) => (
        <Box key={item} as="li">
          {item}
        </Box>
      ))}
    </Fragment>
  );
}

export { Results };
export type { ResultsProps };
