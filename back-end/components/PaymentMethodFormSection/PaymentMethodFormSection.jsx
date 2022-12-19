import React from "react";
import PropTypes from "prop-types";
import { PAYMENT_METHODS } from "Utils/constants.jsx";
import "./PaymentMethodFormSection.scss";

export default function PaymentMethodFormSection({
  allowInvoice,
  allowStripe,
  allowPreAuth,
  isDisabled,
  paymentMethod,
  poNumber,
  onChange,
  onChangePoNumber
}) {
  function renderPoNumberSection() {
    if (!allowInvoice || paymentMethod !== PAYMENT_METHODS.invoice) {
      return null;
    }

    return (
      <div className="row po-number-section">
        <label htmlFor="poNumber" className="col-md-4 control-label">
          PO Number:
        </label>
        <div className="col-md-8">
          <input
            className="form-control"
            disabled={isDisabled}
            name="poNumber"
            onChange={onChangePoNumber}
            type="text"
            value={poNumber}
          />
        </div>
      </div>
    );
  }

  let options = [];
  if (allowStripe) {
    options.push(
      <option key="stripe" value={PAYMENT_METHODS.stripe}>
        Credit card on file
      </option>
    );
  }

  if (allowPreAuth) {
    options.push(
      <option key="pre-auth" value={PAYMENT_METHODS.preAuth}>
        Pre-authorize a credit card and invoice
      </option>
    );
  }

  options.push(
    <option key="credit-card" value={PAYMENT_METHODS.creditCard}>
      New credit card
    </option>
  );
  options.push(
    <option key="cash" value={PAYMENT_METHODS.cash}>
      Cash
    </option>
  );

  if (allowInvoice) {
    options.push(
      <option key="invoice" value={PAYMENT_METHODS.invoice}>
        Invoice
      </option>
    );
  }

  return (
    <React.Fragment>
      <div className="row">
        <label htmlFor="paymentMethod" className="col-md-4 control-label">
          Payment Method
        </label>
        <div className="col-md-8">
          <select
            name="paymentMethod"
            className="form-control"
            value={paymentMethod}
            onChange={e => {
              onChange(e.target.value);
            }}
            disabled={isDisabled}
          >
            {options}
          </select>
        </div>
      </div>
      {renderPoNumberSection()}
    </React.Fragment>
  );
}

PaymentMethodFormSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  paymentMethod: PropTypes.string,
  onChangePoNumber: PropTypes.func.isRequired,
  poNumber: PropTypes.string,
  allowStripe: PropTypes.bool,
  allowInvoice: PropTypes.bool,
  allowPreAuth: PropTypes.bool,
  isDisabled: PropTypes.bool
};

PaymentMethodFormSection.defaultProps = {
  paymentMethod: PAYMENT_METHODS.creditCard,
  allowStripe: false,
  allowInvoice: true,
  allowPreAuth: false,
  isDisabled: false,
  poNumber: ""
};
