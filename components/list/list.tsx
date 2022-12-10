import { Box } from "components/box";
import { ReactNode } from "react";

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}

function List<T extends unknown>({ items, renderItem }: ListProps<T>) {
  return <Box as="ul">{items.map(renderItem)}</Box>;
}

export { List };
export type { ListProps };
