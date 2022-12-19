import React from "react";
import { storiesOf } from "@storybook/react";
import Map from "./Map";

const locations = [
  {
    address: {
      street: "123 Cumberland Avenue",
      city: "Los Angeles",
      province: "CA",
      postalCode: "90310"
    },
    details: {
      orderId: 1233,
      name: "John Doe",
      startDate: "2021-04-20",
      endDate: "2021-04-27",
      binId: "20-05"
    }
  },
  {
    address: {
      street: " 234 S Atlantic Blvd",
      city: "Alhambra",
      province: "CA",
      postalCode: "91801"
    },
    details: {
      orderId: 1234,
      name: "Acme Inc.",
      startDate: "2021-04-19",
      endDate: "2021-04-29",
      binId: "20-01"
    }
  }
];

storiesOf("Components/Map", module).add("Basic", () => (
  <Map locations={locations} isVisible width={500} height={500} />
));
