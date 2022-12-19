import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import "./ClearDatesButton.scss";

export default function ClearDatesButton({ dropOffDate, onClick }) {
  if (!dropOffDate) {
    return null;
  }

  return (
    <Button className="create-order__clear-dates-button" onClick={onClick}>
      Clear
    </Button>
  );
}

ClearDatesButton.propTypes = {
  dropOffDate: PropTypes.object,
  onClick: PropTypes.func.isRequired
};

ClearDatesButton.defaultProps = {
  dropOffDate: null
};
