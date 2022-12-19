import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { post } from "Utils/services.jsx";
import PendingButton from "Components/PendingButton";
import Errors from "Components/Errors";

export default class DeleteOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      errors: []
    };
  }

  deleteOrder = async () => {
    this.setState({ deleting: true });

    try {
      await post("/api/v1/order-delete.php", {
        orderId: this.props.orderId
      });
      this.props.afterDeleteOrder(); // hides modal, sidepanel and removes order from list
    } catch (errorMessage) {
      this.setState({
        errors: [errorMessage]
      });
    }

    this.setState({ deleting: false });
  };

  renderRefundMessage = () =>
    this.props.paidUsingCreditCard
      ? "All items on the order that were paid for via credit card will be refunded automatically."
      : null;

  getBackdrop = () => {
    return this.state.deleting ? "static" : true;
  };

  render() {
    const refundButtonText = this.props.paidUsingCreditCard ? "Delete Order and Refund" : "Delete Order";

    return (
      <Modal
        backdrop={this.getBackdrop()}
        enforceFocus
        onHide={this.props.hideDeleteOrderModal}
        keyboard={!this.state.deleting}
        restoreFocus
        show={this.props.isVisible}
      >
        <Modal.Header closeButton={!this.state.deleting}>
          <Modal.Title>Delete Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Errors errors={this.state.errors} onDismiss={() => this.setState({ errors: [] })} onTop={false} />
          <p>Are you sure you want to delete this order? {this.renderRefundMessage()}</p>
        </Modal.Body>
        <Modal.Footer>
          <PendingButton
            pending={this.state.deleting}
            onClick={() => {
              this.deleteOrder();
            }}
            text={refundButtonText}
            pendingText="Deleting..."
            bsStyle="danger"
          />
        </Modal.Footer>
      </Modal>
    );
  }
}

DeleteOrderModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideDeleteOrderModal: PropTypes.func.isRequired,
  orderId: PropTypes.number.isRequired,
  afterDeleteOrder: PropTypes.func.isRequired,
  paidUsingCreditCard: PropTypes.bool.isRequired
};
