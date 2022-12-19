import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, select, text } from "@storybook/addon-knobs";
import Input from ".";

storiesOf("Components/Input", module)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <Input
      disabled={boolean("disabled", false)}
      label={text("label", "My label")}
      name="emailAddress"
      onChange={() => {}}
      type={select("type", { text: "text", number: "number" }, "text")}
      value={text("value", "Enter text here...")}
    />
  ));
