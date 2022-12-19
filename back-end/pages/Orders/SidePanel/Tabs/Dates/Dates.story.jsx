import React from "react";
import { storiesOf } from "@storybook/react";
import Dates from "./Dates.jsx";

storiesOf("App Pages/Orders/Dates", module).add("index", () => (
  <Dates
    afterSaveDates={(id, d, p) => {
      console.log(id, d, p);
    }}
    closedDaysOfWeek="0,6"
    dropOff="2018-05-20"
    holidays={[]}
    id={1}
    pickUp="2018-05-23"
  />
));
