import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, select, number } from "@storybook/addon-knobs";
import ManualDiscountLine from "./ManualDiscountLine.jsx";

storiesOf("App Pages/Create Order/Payment", module)
  .addDecorator(withKnobs)
  .add("ManualDiscountLine", () => (
    <ManualDiscountLine
      amount={-10}
      isExpanded
      onClickRemove={() => {
        console.log("onClickRemove");
      }}
    />
  ));
