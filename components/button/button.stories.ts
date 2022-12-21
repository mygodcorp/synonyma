// Button.stories.ts

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  //👇 Enables auto-generated documentation for the component story
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};
