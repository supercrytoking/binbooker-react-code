import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean } from "@storybook/addon-knobs";
import Code from "./Code.jsx";

storiesOf("App Pages/Create Order/Steps", module)
  .addDecorator(withKnobs)
  .add("Code - Canada", () => (
    <Code
      customUserText={text("customUserText", "Put customer text here")}
      currency="CAD"
      error={text("error", "")}
      postalCode={text("postalCode", "M4A 2M9")}
      isBackEnd={boolean("isBackEnd", false)}
      isLoading={boolean("isLoading", false)}
      isPostalCodeInServiceableArea={() => true}
      onChange={() => {}}
      onValidContinue={() => alert("All data valid. Submitting...")}
      usersPhoneNumber="1-800-123-4567"
    />
  ))
  .add("Code - USA", () => (
    <Code
      customUserText={text("customUserText", "Put customer text here")}
      currency="USD"
      error={text("error", "")}
      postalCode={text("postalCode", "M4A2M9")}
      isBackEnd={boolean("isBackEnd", false)}
      isLoading={boolean("isLoading", false)}
      isPostalCodeInServiceableArea={() => true}
      onChange={() => {}}
      onValidContinue={() => alert("All data valid. Submitting...")}
      usersPhoneNumber="1-800-123-4567"
    />
  ));
