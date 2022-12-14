import { ComponentStory, ComponentMeta } from "@storybook/react";
import { WordRow } from "./word-row";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/WordRow",
  component: WordRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof WordRow>;

export const Default: ComponentStory<typeof WordRow> = (props) => (
  <WordRow {...props} />
);

Default.args = {
  word: "test",
};
