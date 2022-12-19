import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import moment from "moment";
import Date from "./Date.jsx";

const today = moment().add(0, "days");
const tomorrow = moment().add(1, "days");
const nextWeek = moment()
  .add(7, "days")
  .format("YYYY-MM-DD");

storiesOf("App Pages/Create Order/Steps", module)
  .addDecorator(withKnobs)
  .add("Date", () => (
    <Date
      colour="#ff0000"
      customUserText={text("customUserText", "Put custom text here")}
      dropOffDate={select("dropOffDate", { blank: null, today }, today)}
      error={text("error", "Error goes here")}
      holidays={[nextWeek]}
      isBackEnd={boolean("isBackEnd", false)}
      isLoading={boolean("isLoading", false)}
      isPickUpDateMandatory={boolean("isPickUpDateMandatory", false)}
      onChange={() => {}}
      onClickBack={() => {}}
      onValidContinue={() => alert("All data valid. Submitting...")}
      pickUpDate={select("pickUpDate", { blank: null, tomorrow }, tomorrow)}
    />
  ));
