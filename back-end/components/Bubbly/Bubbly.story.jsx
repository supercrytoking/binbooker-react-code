import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, select } from "@storybook/addon-knobs";
import Bubbly from "./Bubbly";

const noop = () => {};

storiesOf("Components/Bubbly", module)
  .addDecorator(withKnobs)
  .add("No results", () => (
    <Bubbly
      kind={Bubbly.kinds.NO_RESULTS}
      title={text("title", "No results found")}
      description={text("description", "The description goes here")}
      actionTitle="Learn more"
      onClick={() => {
        alert("you clicked it");
      }}
    />
  ))
  .add("No action", () => (
    <Bubbly
      kind={Bubbly.kinds.NO_RESULTS}
      title={text("title", "No results found")}
      description={text("description", "The description goes here")}
    />
  ));
