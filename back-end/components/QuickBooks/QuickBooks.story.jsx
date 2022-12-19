import React from "react";
import { storiesOf } from "@storybook/react";
import QuickBooksButton from "./Button";

storiesOf("Components/QuickBooks", module).add("index", () => (
  <QuickBooksButton
    onClick={() => {
      alert("clicked");
    }}
  />
));
