import React from "react";
import { storiesOf } from "@storybook/react";
import { AddItemsModal } from "./AddItemsModal.jsx";

storiesOf("App Pages/Orders/Items/AddItemsModal", module).add("index", () => (
  <AddItemsModal
    availableItems={[
      { id: 1, name: "One", unitPrice: 10 },
      { id: 2, name: "Twos", unitPrice: 20 }
    ]}
    chargeAndAddItemsToScreen={() => {
      return { success: false, error: "showing an error as a test" };
    }}
    isVisible
    handleHideAddItemsModal={() => {}}
    stripe={null}
    stripeId="abc123"
    tax1Name="GST"
    tax1Rate={0.05}
    tax2Name="PST"
    tax2Rate={0.08}
  />
));
