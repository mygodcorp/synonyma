import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Search } from "./search";

export default {
  title: "Example/Search",
  component: Search,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Search>;

const Template: ComponentStory<typeof Search> = (args) => <Search {...args} />;

export const Default = Template.bind({});
