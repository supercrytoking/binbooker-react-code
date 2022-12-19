import React from "react";
import { storiesOf } from "@storybook/react";
import { Elements, StripeProvider } from "react-stripe-elements";
import CreditCardFormSection from ".";

storiesOf("Components/CreditCardFormSection", module).add("index", () => (
  <StripeProvider apiKey="pk_test_12345">
    <Elements>
      <CreditCardFormSection apiKey="pk_test_6pRNASCoBOKtIshFeQd4XMUh" />
    </Elements>
  </StripeProvider>
));
