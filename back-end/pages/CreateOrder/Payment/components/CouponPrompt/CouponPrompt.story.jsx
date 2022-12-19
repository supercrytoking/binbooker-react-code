import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, select, number } from "@storybook/addon-knobs";
import CouponPrompt from "./CouponPrompt.jsx";

storiesOf("App Pages/Create Order/Payment", module)
  .addDecorator(withKnobs)
  .add("CouponPrompt", () => (
    <CouponPrompt
      availableCoupons={[
        { code: "test1", value: 10 },
        { code: "test2", value: 20 }
      ]}
      applyCoupon={str => {
        console.log(`They applied coupon code: ${str}`);
      }}
      isBackEnd={boolean("isBackEnd", false)}
    />
  ));
