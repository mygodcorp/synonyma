import React from "react";
import { ComponentStory, ComponentMeta, Story } from "@storybook/react";

import { List, ListProps } from "./list";
import { Box } from "components/box";

export default {
  title: "Example/List",
  component: List,
} as ComponentMeta<typeof List>;

const Template: Story<ListProps<{ word: string; id: string }>> = (args) => (
  <List
    items={[
      { word: "hello", id: "1" },
      { word: "hello", id: "2" },
    ]}
    renderItem={(item) => <Box as="li">{item.word}</Box>}
  />
);

export const Default = Template.bind({});
