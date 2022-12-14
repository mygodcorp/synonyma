import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MetaBar } from "./meta-bar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/MetaBar",
  component: MetaBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof MetaBar>;

export const Default: ComponentStory<typeof MetaBar> = (props) => (
  <MetaBar {...props} />
);

Default.args = {
  label: "Label",
  symbol: "♣",
};
