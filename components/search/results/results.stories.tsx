import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Results } from "./results";

export default {
  title: "Example/Results",
  component: Results,
} as ComponentMeta<typeof Results>;

const Template: ComponentStory<typeof Results> = (args) => (
  <Results items={[]} onClick={() => null} />
);

export const Default = Template.bind({});
