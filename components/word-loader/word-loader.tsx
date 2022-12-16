import { ReactNode } from "react";
import styles from "./word-loader.module.css";
import { Container } from "components/container/container.stories";
import * as Grid from "components/grid";
import ContentLoader from "react-content-loader";
import { Skeleton } from "components/skeleton/skeleton";

interface WordRowProps {
  children?: ReactNode;
}

export const WordLoader = ({ ...restProps }: WordRowProps): JSX.Element => (
  <Container as="li" px="PX-SM" className={styles.root} {...restProps}>
    <Grid.Root columns={3} gap={32}>
      <Grid.Item start={2} justify="stretch">
        <Skeleton w={100} h={20} />
      </Grid.Item>
      <Grid.Item start={3} justify="end">
        <Skeleton w={20} h={20} />
      </Grid.Item>
    </Grid.Root>
  </Container>
);
