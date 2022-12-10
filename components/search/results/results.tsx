import { Box } from "components/box";
import { List } from "components/list";
import Fuse from "fuse.js";

interface ResultsProps {
  items: FuseResult[];
  onClick: React.MouseEventHandler<HTMLLIElement>;
}

function Results({ items, onClick }: ResultsProps) {
  if (!items.length) return null;
  return (
    <List<FuseResult>
      items={items}
      renderItem={(data) => (
        <Box
          className=" bg-neutral-100 rounded-lg px-3 py-2 mt-1"
          as="li"
          onClick={onClick}
          key={data.item.id}
        >
          {data.item.word}
        </Box>
      )}
    />
  );
}

export { Results };
export type { ResultsProps };
