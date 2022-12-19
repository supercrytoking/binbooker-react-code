import React from "react";
import PropTypes from "prop-types";
import SidePanel from "Components/SidePanel";
import Input from "Components/Input";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import PendingButton from "Components/PendingButton";
import Errors from "Components/Errors";
import DeleteModal from "Components/DeleteModal";
import Bubbly from "Components/Bubbly";
import { formatDollarAmount, isValidDollarAmount } from "Utils/library.jsx";
import "./ItemsPage.scss";

export default class ItemsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidePanelOpen: false,
      isDeleteModalOpen: false,
      errors: [],
      loadedItem: {
        id: null,
        name: "",
        unitPrice: ""
      }
    };
  }

  handleCloseSidePanel = () => {
    this.setState({ isSidePanelOpen: false });
  };

  handleClickedItem(item) {
    this.setState({
      isSidePanelOpen: true,
      loadedItem: {
        id: item.id,
        name: item.name,
        unitPrice: item.unitPrice
      }
    });
  }

  handleClickSave = () => {
    const newItem = {
      id: this.state.loadedItem.id,
      name: this.state.loadedItem.name,
      unitPrice: this.state.loadedItem.unitPrice
    };
    if (newItem.id) {
      this.props.onSaveItem(newItem);
    } else {
      this.props
        .onCreateItem(newItem)
        .then(() => {
          this.setState({
            isSidePanelOpen: false,
            loadedItem: {
              id: null,
              name: "",
              unitPrice: ""
            }
          });
        })
        .catch(errorMessage => {
          this.setState({
            errors: [errorMessage]
          });
        });
    }
  };

  handleClickDelete = () => {
    this.props
      .onDeleteItem(this.state.loadedItem.id)
      .then(() => {
        this.setState({
          isSidePanelOpen: false,
          isDeleteModalOpen: false,
          loadedItem: {
            id: null,
            name: "",
            unitPrice: ""
          }
        });
      })
      .catch(errorMessage => {
        this.setState({
          errors: [errorMessage]
        });
      });
  };

  handleClickCreate = () => {
    this.setState({
      isSidePanelOpen: true,
      loadedItem: {
        id: null,
        name: "",
        unitPrice: ""
      }
    });
  };

  handleChangeName = e => {
    this.setState({
      loadedItem: {
        id: this.state.loadedItem.id,
        name: e.target.value,
        unitPrice: this.state.loadedItem.unitPrice
      }
    });
  };

  handleChangePrice = e => {
    this.setState({
      loadedItem: {
        id: this.state.loadedItem.id,
        name: this.state.loadedItem.name,
        unitPrice: e.target.value
      }
    });
  };

  renderDeleteModal() {
    return (
      <DeleteModal
        subjectName="Item"
        isVisible={this.state.isDeleteModalOpen}
        onClose={() => this.setState({ isDeleteModalOpen: false })}
        onDelete={this.handleClickDelete}
        isPending={this.props.isDeleting}
      />
    );
  }

  renderActionButtons() {
    const text = this.state.loadedItem.id === null ? "Create" : "Save";
    const pendingText = this.state.loadedItem.id === null ? "Creating..." : "Saving...";
    const isPriceValid = isValidDollarAmount(this.state.loadedItem.unitPrice);

    return (
      <div className="items-action-buttons">
        <PendingButton
          disabled={this.state.loadedItem.name && this.state.loadedItem.unitPrice && isPriceValid ? false : true}
          pending={this.props.isSaving}
          onClick={this.handleClickSave}
          text={text}
          pendingText={pendingText}
        />
        {this.state.loadedItem.id !== null && (
          <PendingButton
            bsStyle="default"
            disabled={this.props.isDeleting}
            pending={this.props.isDeleting}
            onClick={() => this.setState({ isDeleteModalOpen: true })}
            text="Delete"
            pendingText="Deleting..."
          />
        )}
      </div>
    );
  }

  renderSidePanel() {
    return (
      <SidePanel open={this.state.isSidePanelOpen} onClose={this.handleCloseSidePanel} heading="Item" width="small">
        <Errors errors={this.state.errors} onDismiss={() => this.setState({ errors: [] })} />
        <Input name="item-name" label="Item Name" value={this.state.loadedItem.name} onChange={this.handleChangeName} />
        <div className="form-group">
          <label htmlFor="unit-price">Unit Price</label>
          <div className="input-group">
            <div className="input-group-addon">$</div>
            <input
              type="text"
              className="form-control"
              name="unit-price"
              value={this.state.loadedItem.unitPrice}
              onChange={this.handleChangePrice}
            />
          </div>
        </div>
        {this.renderActionButtons()}
      </SidePanel>
    );
  }

  renderCreateButton() {
    return (
      <div className="btn__create">
        <button className="btn btn-default" onClick={this.handleClickCreate}>
          Create new Item
        </button>
      </div>
    );
  }

  renderTable() {
    if (!this.props.items) {
      return <SpinnerCentred />;
    }

    if (!this.props.items.length) {
      return (
        <Bubbly
          title="No Items"
          description="Click the button below to create your first Item."
          actionTitle="Create new Item"
          onClick={this.handleClickCreate}
        />
      );
    }

    return (
      <React.Fragment>
        <table className="table table-striped items__table">
          <thead>
            <tr>
              <th className="items__code">Item Name</th>
              <th className="items__start">Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {this.props.items.map(item => {
              return (
                <tr
                  key={item.id}
                  onClick={() => {
                    this.handleClickedItem(item);
                  }}
                >
                  <td>{item.name}</td>
                  <td>{formatDollarAmount(item.unitPrice)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.renderCreateButton()}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="items-page">
        {this.renderTable()}
        {this.renderDeleteModal()}
        {this.renderSidePanel()}
      </div>
    );
  }
}

ItemsPage.propTypes = {
  items: PropTypes.array,
  isSaving: PropTypes.bool,
  onCreateItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onSaveItem: PropTypes.func
};

ItemsPage.defaultProps = {};
