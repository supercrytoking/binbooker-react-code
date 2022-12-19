import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, select, text } from "@storybook/addon-knobs";
import Select from "./Select.jsx";

storiesOf("Components/Select", module)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <Select
      name="country"
      label={text("label", "My label")}
      value={2}
      options={[
        { value: 0, text: "Zero" },
        { value: 1, text: "One" },
        { value: 2, text: "Two" },
        { value: 3, text: "Three" }
      ]}
      onChange={() => {}}
      disabled={boolean("disabled", false)}
    />
  ));
