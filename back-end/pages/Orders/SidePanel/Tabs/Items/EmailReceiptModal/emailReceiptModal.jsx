import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { post } from "Utils/services.jsx";
import PendingButton from "Components/PendingButton";
import Errors from "Components/Errors";

export default class EmailReceiptModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
      errors: []
    };
  }

  emailReceipt = async () => {
    this.setState({ sending: true });

    try {
      await post("/api/v1/order-email-receipt.php", { orderId: this.props.orderId });
      this.props.afterEmailReceipt();
    } catch (errorMessage) {
      this.setState({
        errors: [errorMessage]
      });
    }

    this.setState({ sending: false });
  };

  render() {
    const receiptOrInvoiceUppercase = this.props.isFullyPaid ? "Receipt" : "Invoice";
    const receiptOrInvoiceLowercase = this.props.isFullyPaid ? "a receipt" : "an invoice";

    return (
      <Modal
        show={this.props.isVisible}
        onHide={() => {
          this.props.hideEmailReceiptModal();
        }}
      >
        <Modal.Header closeButton>
          <Errors errors={this.state.errors} onDismiss={() => this.setState({ errors: [] })} />
          <Modal.Title>Email Customer {receiptOrInvoiceUppercase}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to email this customer {receiptOrInvoiceLowercase}?</p>
        </Modal.Body>
        <Modal.Footer>
          <PendingButton
            pending={this.state.sending}
            onClick={() => {
              this.emailReceipt();
            }}
            text={`Email Customer ${receiptOrInvoiceUppercase}`}
            pendingText="Sending..."
          />
        </Modal.Footer>
      </Modal>
    );
  }
}

EmailReceiptModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isFullyPaid: PropTypes.bool.isRequired,
  hideEmailReceiptModal: PropTypes.func.isRequired,
  orderId: PropTypes.number.isRequired,
  afterEmailReceipt: PropTypes.func.isRequired
};
