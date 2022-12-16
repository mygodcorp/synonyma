import { ReactNode } from "react";
import { Box } from "components/box";
import styles from "./skeleton.module.css";

interface SkeletonProps {
  children?: ReactNode;
  w?: number;
  h?: number;
}

export const Skeleton = ({
  w = 10,
  h = 10,
  ...restProps
}: SkeletonProps): JSX.Element => (
  <Box
    style={{ width: w, height: h }}
    as="div"
    className={styles.root}
    {...restProps}
  />
);
