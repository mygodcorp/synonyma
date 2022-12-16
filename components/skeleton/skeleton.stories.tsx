import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Skeleton } from "./skeleton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Skeleton",
  component: Skeleton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Skeleton>;

export const Default: ComponentStory<typeof Skeleton> = (props) => <Skeleton />;
