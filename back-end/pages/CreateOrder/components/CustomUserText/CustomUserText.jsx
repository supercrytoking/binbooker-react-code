import React from "react";
import PropTypes from "prop-types";
import "./CustomUserText.scss";

export default function CustomUserText({ text }) {
  return text && text.length ? <div className="custom-user-text" dangerouslySetInnerHTML={{ __html: text }} /> : null;
}

CustomUserText.propTypes = {
  text: PropTypes.string
};

CustomUserText.defaultProps = {
  text: ""
};
