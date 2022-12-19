import React from "react";
import { bool } from "prop-types";
import { CardNumberElement, CardExpiryElement, CardCVCElement } from "react-stripe-elements";
import "./CreditCardFormSection.scss";

// https://github.com/stripe/react-stripe-elements#getting-started
// Note: can add `onBlur`, `onChange`, `onFocus` and `onReady` to each Element

class CreditCardFormSection extends React.Component {
  render() {
    return (
      <div className="form credit-card-form">
        <div className="row">
          <div className="col-md-12 no-padding card-number-wrapper">
            <label className="control-label">Card Number</label>
            <CardNumberElement disabled={this.props.isDisabled} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6 no-padding expiry-wrapper">
            <label className="control-label">Expiry Date</label>
            <CardExpiryElement disabled={this.props.isDisabled} />
          </div>
          <div className="col-xs-6 no-padding cvc-wrapper">
            <label className="control-label">Card Security Code</label>
            <CardCVCElement disabled={this.props.isDisabled} />
          </div>
        </div>
      </div>
    );
  }
}

CreditCardFormSection.propTypes = {
  isDisabled: bool
};

CreditCardFormSection.defaultProps = {
  isDisabled: false
};

export default CreditCardFormSection;
