import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, select } from "@storybook/addon-knobs";
import PaymentMethodFormSection from ".";
import { PAYMENT_METHODS } from "Utils/constants.jsx";

storiesOf("Components/PaymentMethodFormSection", module)
  .addDecorator(withKnobs)
  .add("PaymentMethodFormSection", () => (
    <PaymentMethodFormSection
      onChange={() => {}}
      paymentMethod={select(
        "paymentMethod",
        {
          stripe: PAYMENT_METHODS.stripe,
          cc: PAYMENT_METHODS.creditCard,
          cash: PAYMENT_METHODS.cash,
          invoice: PAYMENT_METHODS.invoice,
          "pre-auth": PAYMENT_METHODS.preAuth
        },
        PAYMENT_METHODS.creditCard
      )}
      allowStripe={boolean("allowStripe", true)}
      allowInvoice={boolean("allowInvoice", true)}
      allowPreAuth={boolean("allowPreAuth", true)}
      isDisabled={boolean("isDisabled", false)}
    />
  ));
