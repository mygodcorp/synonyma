import { ReactNode } from "react";
import styles from "./word-loader.module.css";
import { Container } from "components/container/container.stories";
import * as Grid from "components/grid";
import ContentLoader from "react-content-loader";

interface WordRowProps {
  children?: ReactNode;
}

export const WordLoader = ({ ...restProps }: WordRowProps): JSX.Element => (
  <ContentLoader
    viewBox="0 0 400 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...restProps}
  >
    <rect x="0" y="16" rx="0" ry="0" width="200" height="8" />
    <rect x="0" y="32" rx="20" ry="20" width="200" height="2" />
    <rect x="0" y="40" rx="0" ry="0" width="200" height="8" />
  </ContentLoader>
);
