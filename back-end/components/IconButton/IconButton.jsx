import React from "react";
import PropTypes from "prop-types";
import "./IconButton.scss";

/**
  Type must be a glyphicon type: https://getbootstrap.com/docs/3.3/components/
 */
function IconButton({ className, isDisabled, onClick, type }) {
  const cn = `icon-button ${className} ${isDisabled ? "icon-button--disabled" : ""}`;

  return (
    <div
      className={cn}
      onClick={() => {
        if (!isDisabled) {
          onClick();
        }
      }}
    >
      <span className={`glyphicon glyphicon-${type}`}></span>
    </div>
  );
}

IconButton.propTypes = {
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

IconButton.defaultProps = {
  className: "",
  isDisabled: false
};

export default IconButton;
