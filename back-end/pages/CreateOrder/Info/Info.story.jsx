import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, select, text } from "@storybook/addon-knobs";
import Info from "./Info.jsx";

const props = {
  customer: {
    id: 1,
    stripeId: "",
    companyName: "Acme Inc.",
    firstName: "John",
    lastName: "Doe",
    phone: "111-222-3333",
    email: "fake@fake.com",
    notes: "Customer notes go here",
    deliveryStreet1: "123 Fake Street",
    deliveryCity: "Brampton",
    deliveryProvince: "BC",
    deliveryPostalCode: "L0P1C0",
    driverNotes: "Notes to driver",
    billingStreet1: "123 Fake Street",
    billingCity: "Toronto",
    billingProvince: "ON",
    billingPostalCode: "M4A 2M9"
  },
  errors: [],
  onChange: () => {},
  onClickBack: () => {},
  onValidContinue: () => {}
};

storiesOf("App Pages/Create Order/Steps", module)
  .addDecorator(withKnobs)
  .add("Info - Form", () => (
    <Info
      {...props}
      customUserText={text("customUserText", "My custom text")}
      currency={select("currency", { CAD: "CAD", USD: "USD" }, "CAD")}
      isBackEnd={boolean("isBackEnd", false)}
      isSameChecked={boolean("isSameChecked", false)}
    />
  ))
  .add("Info - Form - 1 error", () => (
    <Info
      {...props}
      customUserText={text("customUserText", "My custom text")}
      currency={select("currency", { CAD: "CAD", USD: "USD" }, "CAD")}
      errors={["Single error."]}
      isBackEnd={boolean("isBackEnd", false)}
      isSameChecked={boolean("isSameChecked", false)}
    />
  ))
  .add("Info - Form multiple errors", () => (
    <Info
      {...props}
      customUserText={text("customUserText", "My custom text")}
      currency={select("currency", { CAD: "CAD", USD: "USD" }, "CAD")}
      errors={["Error one", "Error two"]}
      isBackEnd={boolean("isBackEnd", false)}
      isSameChecked={boolean("isSameChecked", false)}
    />
  ));
