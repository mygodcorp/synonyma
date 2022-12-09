import React from "react";

/* -------------------------------------------------------------------------------------------------
 * Box
 * -----------------------------------------------------------------------------------------------*/

type BoxComponent = <C extends React.ElementType>(
  props: BoxProps<C>
) => JSX.Element | null;

type BoxProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    children?: React.ReactNode;
    className?: string;
  }
>;

/* -------------------------------------------------------------------------------------------------
 * Box
 * -----------------------------------------------------------------------------------------------*/

const Box: BoxComponent = React.forwardRef(
  <C extends React.ElementType>(
    { as, children, className, ...restProps }: BoxProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || "span";
    return (
      <Component
        ref={ref}
        data-component="box-component"
        className={className}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

export { Box };
export type { BoxProps };
