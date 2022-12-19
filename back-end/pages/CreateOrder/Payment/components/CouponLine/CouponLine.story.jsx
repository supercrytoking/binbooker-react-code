import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, select, number } from "@storybook/addon-knobs";
import CouponLine from "./CouponLine.jsx";

storiesOf("App Pages/Create Order/Payment", module)
  .addDecorator(withKnobs)
  .add("CouponLine", () => (
    <CouponLine
      amount={-20}
      isExpanded
      onClickRemove={() => {
        console.log("onClickRemove");
      }}
    />
  ));
