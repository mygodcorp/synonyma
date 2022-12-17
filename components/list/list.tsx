import { Box } from "components/box";
import React, { forwardRef, ReactNode } from "react";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

interface ListProps<T> {
  items: T[];
  id?: string;
  renderItem: (item: T, index: number) => ReactNode;
}

function ListComponent<T extends unknown>(
  { items, renderItem, ...restProps }: ListProps<T>,
  ref: React.ForwardedRef<any>
) {
  return (
    <Box ref={ref} as="ul" {...restProps}>
      {items.map(renderItem)}
    </Box>
  );
}

const List = React.forwardRef(ListComponent);

export { List };
export type { ListProps };
