import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, select } from "@storybook/addon-knobs";
import IconButton from "./IconButton.jsx";

storiesOf("Components/IconButton", module)
  .addDecorator(withKnobs)
  .add("Type", () => (
    <IconButton
      className=""
      isDisabled={false}
      onClick={() => {
        alert("clicked");
      }}
      type={select("type", { glass: "glass", trash: "trash", zoomIn: "zoom-in" }, "trash")}
    />
  ))
  .add("Disabled", () => (
    <IconButton
      className=""
      isDisabled
      onClick={() => {
        alert("clicked");
      }}
      type="trash"
    />
  ));
