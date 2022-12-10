type Fuse = import("fuse.js").default;
interface IParams {
  created_at: string;
  word: string;
  synonyme_processed: false;
  definition: string | null;
  slug: string;
  id: string;
  definition_processed: false;
}

type FuseResult = Fuse.FuseResult<{ word: string; id: string; slug: string }>;

type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<C extends React.ElementType, Props = {}> =
  React.PropsWithChildren<Props & AsProp<C>> &
    Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicComponentPropWithRef<C extends React.ElementType, Props = {}> =
  PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };
