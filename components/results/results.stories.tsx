import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Results } from "./results";

export default {
  title: "Example/Results",
  component: Results,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Results>;

const Template: ComponentStory<typeof Results> = (args) => (
  <Results {...args} />
);

Template.args = {
  //items: [{ word: "hello" }],
  onClick: () => null,
};

export const Default = Template.bind({});
