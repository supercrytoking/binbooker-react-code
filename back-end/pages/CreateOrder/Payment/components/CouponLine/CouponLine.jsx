import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { formatDollarAmount } from "Utils/library.jsx";

export default function CouponLine({ amount, couponCode, onClickRemove }) {
  return (
    <div className="row">
      <label className="pricing-left control-label italic">
        Coupon ({couponCode}):
        <Button bsSize="xsmall" bsStyle="link" onClick={onClickRemove}>
          remove
        </Button>
      </label>
      <div className="pricing-right italic" data-qa-id="coupon-value">
        {formatDollarAmount(amount * -1)}
      </div>
    </div>
  );
}

CouponLine.propTypes = {
  amount: PropTypes.number.isRequired,
  couponCode: PropTypes.string.isRequired,
  onClickRemove: PropTypes.func.isRequired
};

CouponLine.defaultProps = {};
