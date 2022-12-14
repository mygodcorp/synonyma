import { ReactNode } from "react";
import { Box } from "components/box";
import styles from "./grid.module.css";

interface GridProps {
  children?: ReactNode;
  columns: number;
  gap?: number;
  align?: "start" | "end" | "center" | "stretch";
}

const Grid = ({
  children,
  columns = 3,
  gap = 8,
  align = "center",
  ...restProps
}: GridProps): JSX.Element => (
  <Box
    as="div"
    style={{
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      rowGap: `${gap}px`,
      alignItems: align,
    }}
    className={styles.root}
    {...restProps}
  >
    {children}
  </Box>
);

interface ItemComponentProps {
  children?: ReactNode;
  start: number;
  justify?: "start" | "end" | "center" | "stretch";
}

const ItemComponent = ({
  children,
  start,
  justify = "start",
  ...restProps
}: ItemComponentProps): JSX.Element => (
  <Box
    as="div"
    style={{ gridColumnStart: start, justifySelf: justify }}
    className={styles.col}
    {...restProps}
  >
    {children}
  </Box>
);

const Root = Grid;
const Item = ItemComponent;

export { Root, ItemComponent, Item, Grid };
