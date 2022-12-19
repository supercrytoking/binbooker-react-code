import React from "react";
// import SampleData from "../../../api/v1/items.json";
import ItemsPage from "./ItemsPage.jsx";

export default class ItemsPageExample extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      isSaving: false
    };
  }

  componentDidMount() {
    this.getItems().then(items => {
      this.setState({ items });
    });
  }

  getItems() {
    return new Promise(function(resolve) {
      // resolve(SampleData);
      resolve();
    });
  }

  handleCreateItem = newItem => {
    const newItems = this.state.items.concat(newItem);
    this.setState({ isSaving: true });
    setTimeout(() => {
      this.setState({ isSaving: false, items: newItems });
    }, 1000);
  };

  handleSaveItem = () => {
    const newItems = this.state.items;
    // newItems.splice(index, 1, newItem);
    this.setState({ isSaving: true });
    setTimeout(() => {
      this.setState({ isSaving: false, items: newItems });
    }, 1000);
  };

  render() {
    return (
      <ItemsPage
        items={this.state.items}
        isSaving={this.state.isSaving}
        onCreateItem={this.handleCreateItem}
        onSaveItem={this.handleSaveItem}
        onDeleteItem={this.handleDeleteItem}
      />
    );
  }
}
