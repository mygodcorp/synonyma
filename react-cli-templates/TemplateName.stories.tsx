import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TemplateName } from "./TemplateName";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/TemplateName",
  component: TemplateName,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TemplateName>;

export const Default: ComponentStory<typeof TemplateName> = (props) => (
  <TemplateName>Hello</TemplateName>
);
