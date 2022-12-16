import { ReactNode } from "react";
import { Box } from "components/box";
import styles from "./word-loader.module.css";

interface WordLoaderProps {
  children?: ReactNode;
}

export const WordLoader = ({
  children,
  ...restProps
}: WordLoaderProps): JSX.Element => (
  <Box as="div" className={styles.root} {...restProps}>
    {children}
  </Box>
);
