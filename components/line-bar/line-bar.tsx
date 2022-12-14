import { ReactNode } from "react";
import { Box } from "components/box";
import styles from "./line-bar.module.css";

interface LineBarProps {
  opacity?: number;
  strong?: number;
}

export const LineBar = ({
  opacity,
  strong = 1,
  ...restProps
}: LineBarProps): JSX.Element => (
  <Box
    as="div"
    style={{ opacity: `${opacity}%`, height: `${strong}px` }}
    className={styles.root}
    {...restProps}
  />
);
