import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, select } from "@storybook/addon-knobs";
import Nav from "./Nav";

storiesOf("App Pages/Create Order", module)
  .addDecorator(withKnobs)
  .add("Nav", () => (
    <Nav
      currentStep={select(
        "currentStep",
        {
          code: "code",
          date: "date",
          service: "service",
          info: "info",
          review: "review",
          confirmation: "confirmation"
        },
        "code"
      )}
      onClickStep={() => {}}
    />
  ));
