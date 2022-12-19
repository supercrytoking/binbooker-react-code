import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, select, number } from "@storybook/addon-knobs";
import ManualDiscountPrompt from "./ManualDiscountPrompt.jsx";

storiesOf("App Pages/Create Order/Payment", module)
  .addDecorator(withKnobs)
  .add("ManualDiscountPrompt", () => (
    <ManualDiscountPrompt
      onApplyManualDiscount={amount => {
        console.log(`They applied manual discount: ${amount}`);
      }}
    />
  ));
