import React from "react";
import { storiesOf } from "@storybook/react";
import ItemsPage from "./ItemsPage";

const props = {
  items: [{ id: 1, name: "My item", unitPrice: 24.99 }],
  isSaving: false,
  onCreateItem: () => {},
  onDeleteItem: () => {},
  onSaveItem: () => {}
};

storiesOf("App Pages/Items", module)
  .add("Basic", () => <ItemsPage {...props} />)
  .add("No Items", () => <ItemsPage {...props} items={[]} />)
  .add("Loading", () => <ItemsPage {...props} items={null} />);
