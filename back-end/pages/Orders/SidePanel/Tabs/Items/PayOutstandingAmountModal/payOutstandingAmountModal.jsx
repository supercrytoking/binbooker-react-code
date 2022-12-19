import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { Elements, StripeProvider, injectStripe } from "react-stripe-elements";
import Errors from "Components/Errors";
import PendingButton from "Components/PendingButton";
import CreditCardFormSection from "Components/CreditCardFormSection";
import PaymentMethodFormSection from "Components/PaymentMethodFormSection";
import { PAYMENT_METHODS } from "Utils/constants.jsx";
import { formatDollarAmount } from "Utils/library.jsx";
import { post } from "Utils/services.jsx";
import "./payOutstandingAmountModal.scss";

class _PayOutstandingAmountModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentMethod: props.stripeId.length > 0 ? PAYMENT_METHODS.stripe : PAYMENT_METHODS.creditCard,
      processing: false,
      errors: []
    };
  }

  renderCreditCardFormSection() {
    if (this.state.paymentMethod === PAYMENT_METHODS.creditCard) {
      return <CreditCardFormSection isDisabled={this.state.processing} />;
    }
    return null;
  }

  submitPayment = async data => {
    try {
      await post("/api/v1/pay-outstanding-amount.php", data);
      this.props.onSuccess(this.state.paymentMethod);
    } catch (errorMessage) {
      this.setState({
        errors: [errorMessage]
      });
    }

    this.setState({ processing: false });
  };

  handleClickPaymentButton = () => {
    this.setState({ processing: true, errors: [] });

    let data = {
      orderId: this.props.orderId,
      amount: this.props.amount, //TODO: calculate this in the back-end(?) instead
      paymentMethod: this.state.paymentMethod
    };

    if (this.state.paymentMethod === PAYMENT_METHODS.creditCard) {
      this.props.stripe
        .createToken({ type: "card" })
        .then(token => {
          data.token = token.token.id;
          this.submitPayment(data);
        })
        .catch(error => {
          this.setState({ processing: false, errors: [error] });
        });
    } else {
      this.submitPayment(data);
    }
  };

  render() {
    const allowStripe = this.props.stripeId.length > 0;
    return (
      <Modal
        className="pay-outstanding-amount-modal"
        show={this.props.isVisible}
        onHide={() => {
          this.props.hideModal();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay Outstanding Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Errors errors={this.state.errors} onDismiss={() => this.setState({ errors: [] })} onTop={false} />
          <div className="row">
            <label className="col-md-4 control-label">Amount Owing</label>
            <div className="col-md-8">{formatDollarAmount(this.props.amount)}</div>
          </div>
          <PaymentMethodFormSection
            onChange={paymentMethod => {
              this.setState({ paymentMethod });
            }}
            paymentMethod={this.state.paymentMethod}
            allowStripe={allowStripe}
            allowInvoice={false}
          />
          {this.renderCreditCardFormSection()}
        </Modal.Body>
        <Modal.Footer>
          <PendingButton
            pending={this.state.processing}
            onClick={this.handleClickPaymentButton}
            text="Submit Payment"
            pendingText="Processing..."
            bsStyle="success"
          />
        </Modal.Footer>
      </Modal>
    );
  }
}

_PayOutstandingAmountModal.propTypes = {
  orderId: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  stripeId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

const PayOutstandingAmountForm = injectStripe(_PayOutstandingAmountModal);

class PayOutstandingAmountModal extends React.Component {
  render() {
    let stripeProps = {};

    if (window.Stripe) {
      stripeProps.apiKey = this.props.apiKey;
    } else {
      stripeProps.stripe = null; //needed for enzyme tests
    }

    return (
      <StripeProvider {...stripeProps}>
        <Elements>
          <PayOutstandingAmountForm {...this.props} />
        </Elements>
      </StripeProvider>
    );
  }
}

PayOutstandingAmountModal.propTypes = {
  apiKey: PropTypes.string
};

PayOutstandingAmountModal.defaultProps = {
  apiKey: "null"
};

export default PayOutstandingAmountModal;
