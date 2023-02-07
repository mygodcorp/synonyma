import React from "react";
import clsx from "clsx";
import { cva, VariantProps } from "class-variance-authority";

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
  } & VariantProps<typeof Styles>
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
      weight,
      className,
      transform,
      ...restProps
    }: TextProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || "h2";
    return (
      <Component
        ref={ref}
        className={clsx(Styles({ size, weight, transform }), className)}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/

const Styles = cva(["whitespace-pre-wrap"], {
  variants: {
    size: {
      xs: ["text-xs"],
      small: ["text-sm"],
      base: ["text-base"],
      medium: ["text-lg", "md:text-xl", "lg:text-2xl"],
      large: ["text-3xl", "md:text-4xl", "lg:text-5xl"],
      xlarge: ["text-6xl", "md:text-7xl", "lg:text-8xl"],
    },
    weight: {
      regular: "font-normal",
      bold: "font-bold",
    },
    transform: {
      capitalize: "capitalize",
      uppercase: "uppercase",
    },
  },
});

export { Text };
export type { TextProps };
