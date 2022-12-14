import { ReactNode } from "react";
import { Box } from "components/box";
import styles from "./template-name.module.css";

interface TemplateNameProps {
  children?: ReactNode;
}

export const TemplateName = ({
  children,
  ...restProps
}: TemplateNameProps): JSX.Element => (
  <Box as="div" className={styles.root} {...restProps}>
    {children}
  </Box>
);
