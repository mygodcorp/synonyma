import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Spacer } from "./spacer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Spacer",
  component: Spacer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Spacer>;

export const Default: ComponentStory<typeof Spacer> = (props) => (
  <Spacer {...props}>Hello</Spacer>
);

Default.args = {
  space: "SM",
};
