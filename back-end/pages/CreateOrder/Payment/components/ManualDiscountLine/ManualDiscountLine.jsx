import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { formatDollarAmount } from "Utils/library.jsx";

export default function ManualDiscountLine({ amount, onClickRemove }) {
  return (
    <div className="row">
      <label className="pricing-left control-label italic">
        Manual discount:
        <Button bsSize="xsmall" bsStyle="link" onClick={onClickRemove}>
          remove
        </Button>
      </label>
      <div className="pricing-right italic" data-qa-id="manual-discount-value">
        {formatDollarAmount(amount * -1)}
      </div>
    </div>
  );
}

ManualDiscountLine.propTypes = {
  amount: PropTypes.number.isRequired,
  onClickRemove: PropTypes.func.isRequired
};

ManualDiscountLine.defaultProps = {};
