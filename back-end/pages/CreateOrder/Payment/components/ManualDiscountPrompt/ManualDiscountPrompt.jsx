import React from "react";
import PropTypes from "prop-types";
import { Alert, Button } from "react-bootstrap";
import "../CouponPrompt/PaymentPrompt.scss";

export default function ManualDiscountPrompt({ isDisabled, onApplyManualDiscount }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [discountAmount, setDiscountAmount] = React.useState(0);

  if (isExpanded) {
    return (
      <Alert bsStyle="info" className="payment-prompt">
        <div className="payment-prompt__instructions">Enter the discount amount:</div>
        <div className="input-group payment-prompt__inputs">
          <div className="input-group-addon">$</div>
          <input
            disabled={isDisabled}
            className="form-control coupon-code__input"
            name="manualDiscountAmount"
            placeholder="0.00"
            type="number"
            value={discountAmount === 0 ? "" : discountAmount}
            onChange={e => {
              setDiscountAmount(e.target.value);
            }}
            data-qa-id="manual-discount"
          />
        </div>
        <div className="payment-prompt__actions">
          <Button
            disabled={isDisabled}
            bsSize="xsmall"
            onClick={() => {
              onApplyManualDiscount(discountAmount);
            }}
          >
            Apply
          </Button>
          <Button
            disabled={isDisabled}
            bsSize="xsmall"
            bsStyle="link"
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            cancel
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="row">
      <Button
        disabled={isDisabled}
        bsSize="xsmall"
        bsStyle="link"
        data-qa-id="expand-manual-discount-prompt"
        onClick={() => {
          setIsExpanded(true);
        }}
      >
        Apply a manual discount
      </Button>
    </div>
  );
}

ManualDiscountPrompt.propTypes = {
  onApplyManualDiscount: PropTypes.func.isRequired
};

ManualDiscountPrompt.defaultProps = {};
