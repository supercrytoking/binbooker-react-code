import React from "react";
import { storiesOf } from "@storybook/react";
import PayOutstandingAmountModal from "./payOutstandingAmountModal.jsx";

let props = {
  amount: 123.45,
  stripeId: "sktest_9a44df2u25sa0ds982jnk43twes",
  isVisible: true,
  hideModal: () => {},
  onSuccess: () => {}
};

storiesOf("App Pages/Orders/Items/PayOutstandingAmountModal", module).add("index", () => (
  <PayOutstandingAmountModal {...props} />
));
