import { Fragment, ReactNode } from "react";
import { Box } from "components/box";
import styles from "./meta-bar.module.css";
import { LineBar } from "components/line-bar/line-bar";
import * as Grid from "components/grid";

interface MetaBarProps {
  label: ReactNode;
  symbol: string;
}

export const MetaBar = ({
  label,
  symbol,
  ...restProps
}: MetaBarProps): JSX.Element => (
  <Fragment>
    <LineBar strong={2} />
    <Grid.Root columns={3} gap={32}>
      <Grid.Item start={1}>
        <Box as="h2" className={styles.label}>
          {label}
        </Box>
      </Grid.Item>
      <Grid.Item start={3} justify="end">
        <Box className={styles.symbol}>{symbol}</Box>
      </Grid.Item>
    </Grid.Root>
  </Fragment>
);
