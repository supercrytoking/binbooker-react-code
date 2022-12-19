import React from "react";
import { storiesOf } from "@storybook/react";
import moment from "moment";
import DatePicker from "Components/DatePicker";

storiesOf("Components/DatePicker", module).add("DatePicker", () => (
  <DatePicker
    date={moment()}
    setDate={newDate => {
      console.log("change date", newDate.format("YYYY-MM-DD"));
    }}
    handleClickPreviousDate={() => {
      console.log("decrease date");
    }}
    handleClickNextDate={() => {
      console.log("increase date");
    }}
  />
));
