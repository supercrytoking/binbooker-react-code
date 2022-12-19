import React from "react";
import PropTypes from "prop-types";
import PendingButton from "Components/PendingButton";
import "./ActionBar.scss";

export default function CreateOrderActionBar({
  disabled,
  loading,
  onClickBack,
  onClickContinue,
  primaryButtonText,
  primaryButtonPendingText
}) {
  primaryButtonPendingText = primaryButtonPendingText ? primaryButtonPendingText : primaryButtonText;

  function handleClickBack(e) {
    e.preventDefault();
    onClickBack();
  }

  return (
    <div className="row action-bar">
      <div className="col-md-12">
        {!loading && onClickBack && (
          <a href="#" onClick={handleClickBack} className="btn btn-link action-bar__back-button">
            « Back
          </a>
        )}
        <PendingButton
          pending={loading}
          disabled={disabled}
          onClick={() => {
            onClickContinue();
          }}
          text={primaryButtonText}
          pendingText={primaryButtonPendingText}
        />
      </div>
    </div>
  );
}

CreateOrderActionBar.propTypes = {
  disabled: PropTypes.bool,
  onClickContinue: PropTypes.func.isRequired,
  onClickBack: PropTypes.func,
  primaryButtonText: PropTypes.string,
  primaryButtonPendingText: PropTypes.string,
  loading: PropTypes.bool
};

CreateOrderActionBar.defaultProps = {
  primaryButtonText: "Continue »",
  primaryButtonPendingText: "",
  loading: false
};
