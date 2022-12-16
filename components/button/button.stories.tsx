import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Button>;

export const Default: ComponentStory<typeof Button> = (props) => (
  <Button>Hello</Button>
);
