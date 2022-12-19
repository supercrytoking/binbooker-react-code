import React from "react";
import PropTypes from "prop-types";
import { formatDollarAmount } from "Utils/library.jsx";

function TaxRow({ name, amount }) {
  if (!name.length) {
    return null;
  }

  return (
    <div>
      <div className="col-xs-9">{name}:</div>
      <div className="col-xs-3">{formatDollarAmount(amount)}</div>
    </div>
  );
}

TaxRow.propTypes = {
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
};

export default TaxRow;
