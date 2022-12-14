import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LineBar } from "./line-bar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/LineBar",
  component: LineBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LineBar>;

export const Default: ComponentStory<typeof LineBar> = (props) => (
  <LineBar {...props}>Hello</LineBar>
);
