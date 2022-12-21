import { ReactNode } from "react";
import { Box } from "components/box";
import styles from "./button.module.css";

export interface ButtonProps {
  children?: ReactNode;
  onClick: () => void;
}

export const Button = ({
  children,
  onClick,
  ...restProps
}: ButtonProps): JSX.Element => (
  <Box as="button" onClick={onClick} className={styles.root} {...restProps}>
    {children}
  </Box>
);

Button.displayName = "Button";
