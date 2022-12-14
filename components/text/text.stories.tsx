import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Text } from "./text";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Text",
  component: Text,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Text>;

export const Default: ComponentStory<typeof Text> = (props) => (
  <Text {...props}>Hello</Text>
);

Default.args = {
  as: "h2",
  size: "XXL",
};
