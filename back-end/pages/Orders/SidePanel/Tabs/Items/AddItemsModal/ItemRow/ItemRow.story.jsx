import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import ItemRow from "./ItemRow.jsx";

const uniqueId = "a022bf"; // the consumer of this component will have this unique identifier

storiesOf("App Pages/Orders/Items/AddItemsModal", module)
  .addDecorator(withKnobs)
  .add("ItemRow", () => (
    <div style={{ width: "568px" }}>
      <ItemRow
        availableItems={[
          { id: 1, name: "Failed pickup", defaultUnitPrice: 100 },
          { id: 2, name: "Fridge", defaultUnitPrice: 25 }
        ]}
        isDisabled={boolean("isDisabled", false)}
        onChangeForm={e => {
          console.log(`changed ${e.target.name} to ${e.target.value} for ${uniqueId}`);
        }}
        onClickRemove={() => {
          console.log(`Remove row ${uniqueId}`);
        }}
        quantity={1.234}
        selectedItemId={2}
        unitPrice={399.99}
      />
    </div>
  ));
