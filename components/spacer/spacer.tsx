import { ReactNode } from "react";
import { Box } from "components/box";
import styles from "./spacer.module.css";
import clsx from "clsx";

interface SpacerProps {
  className?: string;
  space: "SM" | "MD" | "LG" | "XL" | "XXL";
}

export const Spacer = ({
  space,
  className,
  ...restProps
}: SpacerProps): JSX.Element => (
  <Box
    as="span"
    className={clsx(styles.root, [styles[space]], className)}
    {...restProps}
  />
);
