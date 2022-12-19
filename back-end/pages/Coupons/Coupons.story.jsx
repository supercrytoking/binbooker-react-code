import React from "react";
import { storiesOf } from "@storybook/react";
import Coupons from "./Coupons";

const props = {
  coupons: null,
  clearError: () => {},
  createCoupon: () => {},
  deleteCoupon: () => {},
  error: "",
  isPending: false,
  services: [],
  updateCoupon: () => {}
};

storiesOf("App Pages/Coupons", module)
  .add("Basic", () => (
    <Coupons
      {...props}
      coupons={[
        {
          id: 1,
          code: "sample",
          validFrom: "2021-12-25",
          validUntil: "2021-12-31",
          services: [{ id: 2, title: "Service 1" }],
          isPercent: "1",
          value: 25
        }
      ]}
    />
  ))
  .add("No coupons", () => <Coupons {...props} coupons={[]} />)
  .add("Loading", () => <Coupons {...props} />);
