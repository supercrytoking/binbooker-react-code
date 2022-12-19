import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";
import Search from "./Search.jsx";

storiesOf("App Pages/Create Order/Steps", module)
  .addDecorator(withKnobs)
  .add("Info - Search", () => (
    <Search
      customers={[]}
      isExpanded={boolean("isExpanded", false)}
      isSearching={boolean("isSearching", false)}
      onChangeSearchString={() => {}}
      onClickAwayFromSearch={() => {}}
      searchString={text("searchString", "John D...")}
      showUnload={boolean("showUnload", false)}
    />
  ));
