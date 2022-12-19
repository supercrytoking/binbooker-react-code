import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import Confirmation from "./Confirmation.jsx";

storiesOf("App Pages/Create Order/Steps", module)
  .addDecorator(withKnobs)
  .add("Confirmation", () => (
    <Confirmation
      companyName="Sample Disposal Ltd."
      companyPhone="1-800-123-4567"
      companyUrl="http://sampledisposal.com"
      companyEmailAddress="sales@sampledisposal.com"
      customerEmailAddress="fake@fake.com"
      onClickCreateAnotherOrder={() => {
        alert("Clicked button");
      }}
      orderId="12345"
    />
  ));
