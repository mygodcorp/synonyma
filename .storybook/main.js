const path = require("path");
module.exports = {
  stories: ["../components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    enabled: true,
    defaultName: "Documentation",
    //👇 Use only one of the following options to auto-generate documentation
    docsPage: "automatic",
  },
};
