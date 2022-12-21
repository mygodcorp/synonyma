import { Text, TextProps } from "./text";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<TextProps<"p">> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Text",
  tags: ["docsPage"],
  component: Text,
};

export default meta;
type Story = StoryObj<TextProps<"p">>;

export const Primary: Story = {
  args: {
    size: "base",
    children: "Hello",
  },
};
