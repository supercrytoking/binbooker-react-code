import React from "react";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import ItemsPage from "./ItemsPage.jsx";
import { arraySortByKey } from "Utils/library.jsx";
import { get, post, put, remove } from "Utils/services.jsx";

export default class ItemsPageWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      items: null,
      isSaving: false,
      isDeleting: false
    };
  }

  componentDidMount() {
    this.getItems();
    document.title = "Items";
  }

  getItems = async () => {
    const json = await get("/api/v2/items");
    this.setState({ items: json });
  };

  handleCreateItem = async newItem => {
    return new Promise(async (resolve, reject) => {
      this.setState({ isSaving: true });

      try {
        const newItemId = await post("/api/v2/items", {
          id: null,
          name: newItem.name,
          unitPrice: newItem.unitPrice
        });
        newItem.id = newItemId;
        const newItems = [...this.state.items, newItem];
        newItems.sort(arraySortByKey("name"));
        this.setState({ items: newItems, isSaving: false });
        resolve();
      } catch (errorMessage) {
        this.setState({ isSaving: false });
        reject(errorMessage);
      }
    });
  };

  handleSaveItem = newItem => {
    return new Promise(async (resolve, reject) => {
      this.setState({ isSaving: true });
      try {
        await put("/api/v2/items", {
          id: newItem.id,
          name: newItem.name,
          unitPrice: newItem.unitPrice
        });
        const newItems = [...this.state.items];
        newItems.forEach(item => {
          if (item.id === newItem.id) {
            item.name = newItem.name;
            item.unitPrice = newItem.unitPrice;
          }
        });
        newItems.sort(arraySortByKey("name"));
        this.setState({ items: newItems, isSaving: false });
        resolve();
      } catch (errorMessage) {
        this.setState({ isSaving: false });
        reject(errorMessage);
      }
    });
  };

  handleDeleteItem = itemId => {
    return new Promise(async (resolve, reject) => {
      this.setState({ isDeleting: true });
      try {
        await remove(`/api/v2/items/${itemId}`);
        const _items = this.state.items.filter(item => item.id !== itemId);
        this.setState({ isDeleting: false, items: _items });
        resolve();
      } catch (errorMessage) {
        this.setState({ isDeleting: false });
        reject(errorMessage);
      }
    });
  };

  render() {
    return (
      <LoggedInStaffContext.Consumer>
        {loggedInStaff => {
          if (!loggedInStaff.pageAccess.manageItems) {
            return null;
          }

          return (
            <ItemsPage
              items={this.state.items}
              isSaving={this.state.isSaving}
              isDeleting={this.state.isDeleting}
              onCreateItem={this.handleCreateItem}
              onSaveItem={this.handleSaveItem}
              onDeleteItem={this.handleDeleteItem}
            />
          );
        }}
      </LoggedInStaffContext.Consumer>
    );
  }
}
