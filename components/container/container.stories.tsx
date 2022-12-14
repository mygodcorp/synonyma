import clsx from "clsx";
import React from "react";
import styles from "./container.module.css";

/* -------------------------------------------------------------------------------------------------
 * Container
 * -----------------------------------------------------------------------------------------------*/

type ContainerComponent = <C extends React.ElementType>(
  props: ContainerProps<C>
) => JSX.Element | null;

type ContainerProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<
    C,
    {
      children?: React.ReactNode;
      maxW?:
        | "MAX-W-SM"
        | "MAX-W-MD"
        | "MAX-W-LG"
        | "MAX-W-XL"
        | "MAX-W-XXL"
        | "MAX-W-FULL";
      py?: "PY-SM" | "PY-MD" | "PY-LG" | "PY-XL" | "PY-XXL";
      className?: string;
    }
  >;

/* -------------------------------------------------------------------------------------------------
 * Container
 * -----------------------------------------------------------------------------------------------*/

const Container: ContainerComponent = React.forwardRef(
  <C extends React.ElementType>(
    {
      as,
      children,
      className,
      maxW = "MAX-W-FULL",
      py = "PY-MD",
      ...restProps
    }: ContainerProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || "div";
    return (
      <Component
        ref={ref}
        data-component="container-component"
        className={clsx(styles[maxW], styles[py], className)}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

export { Container };
export type { ContainerProps };
