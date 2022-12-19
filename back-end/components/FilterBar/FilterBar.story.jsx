import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, select } from "@storybook/addon-knobs";
import FilterBar from ".";

const noop = () => {};

storiesOf("Components/FilterBar", module)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <FilterBar
      placeholder={text("placeholder", "Placeholder...")}
      onChange={() => {}}
      type={select("type", { filter: "filter", search: "search" }, "filter")}
      value={text("value", "John")}
    />
  ));
