import { ReactNode } from "react";
import { Box } from "components/box";
import styles from "./meta-bar.module.css";

interface MetaBarProps {
  label: string;
  symbol: string;
}

export const MetaBar = ({
  label,
  symbol,
  ...restProps
}: MetaBarProps): JSX.Element => (
  <Box as="div" className={styles.root} {...restProps}>
    <Box as="h2" className={styles.label}>
      {label}
    </Box>
    <Box className={styles.symbol}>{symbol}</Box>
  </Box>
);
