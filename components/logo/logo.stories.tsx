import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Logo } from "./logo";

export default {
  title: "Example/Logo",
  component: Logo,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />;

export const Default = Template.bind({});
