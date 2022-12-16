import { ComponentStory, ComponentMeta } from "@storybook/react";
import { WordLoader } from "./word-loader";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/WordLoader",
  component: WordLoader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof WordLoader>;

export const Default: ComponentStory<typeof WordLoader> = (props) => (
  <WordLoader {...props}>Hello</WordLoader>
);
