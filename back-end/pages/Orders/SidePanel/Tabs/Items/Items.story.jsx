import React from "react";
import { storiesOf } from "@storybook/react";
import Items from "./Items.jsx";

storiesOf("App Pages/Orders/Items", module).add("index", () => (
  <OrderItems
    orderId={1}
    orderItems={[
      {
        id: 1,
        orderId: 1,
        description: "Rental",
        quantity: 1.0,
        unitPrice: 300.0,
        tax1: 0.05,
        tax2: 0.08,
        paymentMethod: "credit-card",
        paymentConfirmationId: "aaa"
      },
      {
        id: 2,
        orderId: 1,
        description: "Weight",
        quantity: 2.5,
        unitPrice: 100.0,
        tax1: 0.05,
        tax2: 0.08,
        paymentMethod: "credit-card",
        paymentConfirmationId: "aab"
      }
    ]}
    afterDeleteItem={() => {}}
    afterDeleteOrder={() => {}}
    items={[]}
    afterAddItem={() => {}}
    tax1={5}
    tax1Name="gst"
    tax2={0}
    tax2Name=""
  />
));
