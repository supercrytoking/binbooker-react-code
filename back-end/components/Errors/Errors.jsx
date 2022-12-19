import React from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";
import "./Errors.scss";

export default function Errors({ errors, onDismiss, onTop }) {
  if (errors.length > 0) {
    const msg = errors.reduce((msg, error) => msg + "\n" + error);
    const onTopClass = onTop ? "on-top" : "";

    return (
      <Alert
        bsStyle="danger"
        className={`errors-wrapper ${onTopClass}`}
        style={{ whiteSpace: "pre-line" }}
        onDismiss={onDismiss}
      >
        {msg}
      </Alert>
    );
  }

  return null;
}

Errors.propTypes = {
  errors: PropTypes.array,
  onDismiss: PropTypes.func,
  onTop: PropTypes.bool
};

Errors.defaultProps = {
  errors: [],
  onTop: true
};
