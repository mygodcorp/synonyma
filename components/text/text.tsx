import React from "react";
import styles from "./text.module.css";
import clsx from "clsx";
/* -------------------------------------------------------------------------------------------------
 * Text
 * -----------------------------------------------------------------------------------------------*/

type TextComponent = <C extends React.ElementType>(
  props: TextProps<C>
) => JSX.Element | null;

type TextProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    children?: React.ReactNode;
    className?: string;
    size: "XXL" | "XL" | "L" | "M" | "S" | "XS";
    transform?: "capitalize" | "uppercase" | "lowercase" | "none";
  }
>;

/* -------------------------------------------------------------------------------------------------
 * Text
 * -----------------------------------------------------------------------------------------------*/

const Text: TextComponent = React.forwardRef(
  <C extends React.ElementType>(
    {
      as,
      children,
      size,
      className,
      transform = "none",
      ...restProps
    }: TextProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || "h2";
    return (
      <Component
        ref={ref}
        className={clsx(styles[size], styles[transform], className)}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

export { Text };
export type { TextProps };
