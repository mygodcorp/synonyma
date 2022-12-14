import { ReactNode } from "react";
import { Box } from "components/box";
import styles from "./container.module.css";

interface ContainerProps {
  maxW: "SM" | "MD" | "LG" | "XL" | "XXL";
  padding?: "SM" | "MD" | "LG" | "XL" | "XXL";
  children?: ReactNode;
}

export const Container = ({
  children,
  ...restProps
}: ContainerProps): JSX.Element => (
  <Box as="div" className={styles.root} {...restProps}>
    {children}
  </Box>
);
