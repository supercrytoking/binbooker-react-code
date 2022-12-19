import React from "react";
import PropTypes from "prop-types";
import { Alert, Button } from "react-bootstrap";
import { formatDollarAmount } from "Utils/library.jsx";
import "./PaymentPrompt.scss";

export default function CouponPrompt({ isDisabled, availableCoupons, isBackEnd, onApplyCoupon }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");

  if (!availableCoupons.length) {
    return null;
  }

  if (isExpanded) {
    let html;

    if (isBackEnd) {
      html = (
        <React.Fragment>
          <div className="payment-prompt__instructions">Select which coupon to apply:</div>
          <div className="payment-prompt__inputs">
            <select
              disabled={isDisabled}
              className="form-control coupon-code__select"
              name="couponCode"
              onChange={e => {
                setCouponCode(e.target.value);
              }}
              value={couponCode}
            >
              <option>- Select -</option>
              {availableCoupons.map(coupon => (
                <option key={`coupon-${coupon.code}`} value={coupon.code}>
                  {coupon.code} ({formatDollarAmount(coupon.value * -1)})
                </option>
              ))}
            </select>
          </div>
        </React.Fragment>
      );
    } else {
      html = (
        <React.Fragment>
          <div className="payment-prompt__instructions">Enter a coupon code:</div>
          <div className="payment-prompt__inputs">
            <input
              disabled={isDisabled}
              className="form-control coupon-code__input"
              name="couponCode"
              value={couponCode}
              placeholder="Coupon code..."
              onChange={e => {
                setCouponCode(e.target.value);
              }}
            />
          </div>
        </React.Fragment>
      );
    }

    return (
      <Alert bsStyle="info" className="payment-prompt">
        {html}
        <div className="payment-prompt__actions">
          <Button
            disabled={isDisabled}
            bsSize="xsmall"
            onClick={() => {
              onApplyCoupon(couponCode);
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
        data-qa-id="expand-coupon-prompt"
        onClick={() => {
          setIsExpanded(true);
        }}
      >
        Apply a coupon code
      </Button>
    </div>
  );
}

CouponPrompt.propTypes = {
  availableCoupons: PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string, value: PropTypes.number })),
  isBackEnd: PropTypes.bool,
  onApplyCoupon: PropTypes.func.isRequired
};

CouponPrompt.defaultProps = {
  availableCoupons: [],
  isBackEnd: false
};
