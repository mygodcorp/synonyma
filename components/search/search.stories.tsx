import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Search } from "./search";
import getSearch from "utils/data/get-search";

export default {
  title: "Example/Search",
  component: Search,
} as ComponentMeta<typeof Search>;

const Template: ComponentStory<typeof Search> = (args) => {
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    setValue(event.target.value);
    setActive(true);
  };

  const onBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
  };

  const onClick: React.MouseEventHandler<HTMLLIElement> = (event) => {
    event.preventDefault();
    setActive(false);
    setValue(event.currentTarget.innerText);
  };

  const results = getSearch(value);

  return (
    <Search
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder="Search"
      items={results}
      suggestions={active}
      onClick={onClick}
    />
  );
};

export const Default = Template.bind({});
