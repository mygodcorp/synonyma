import { ReactNode } from "react";
import styles from "./word-row.module.css";
import { Container } from "components/container/container";
import * as Grid from "components/grid";
import Link from "next/link";
import { Text } from "components/text/text";
import ArrowRight from "components/icons/arrow-right";

interface WordRowProps {
  children?: ReactNode;
  word: string;
  id?: string;
}

export const WordRow = ({ word, ...restProps }: WordRowProps): JSX.Element => (
  <Container as="li" py="PY-MD" className={styles.root} {...restProps}>
    <Grid.Root columns={3} gap={32}>
      <Grid.Item start={2}>
        <Link href={`/${word}`}>
          <Text as="p" size="M" transform="capitalize">
            {word}
          </Text>
        </Link>
      </Grid.Item>
      <Grid.Item start={3} justify="end">
        <Link href={`/${word}`}>
          <ArrowRight />
        </Link>
      </Grid.Item>
    </Grid.Root>
  </Container>
);
