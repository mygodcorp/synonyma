import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Grid } from "./grid";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Grid",
  component: Grid,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Grid>;

export const Default: ComponentStory<typeof Grid> = (props) => (
  <Grid {...props}>Hello</Grid>
);

Default.args = {
  columns: 2,
};
