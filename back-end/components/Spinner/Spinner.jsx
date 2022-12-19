// Based on spinner from https://projects.lukehaas.me/css-loaders/

import React from "react";
import PropTypes from "prop-types";
import "./Spinner.scss";

export default function Spinner({ colour, size }) {
  return <div className={`Spinner Spinner--${size} Spinner--${colour}`}>Loading...</div>;
}

Spinner.propTypes = {
  colour: PropTypes.string,
  size: PropTypes.string
};

Spinner.defaultProps = {
  colour: "black",
  size: "medium"
};
