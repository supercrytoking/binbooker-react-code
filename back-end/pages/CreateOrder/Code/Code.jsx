import React from "react";
import PropTypes from "prop-types";
import ReactCodeInput from "react-code-input";
import CreateOrderActionBar from "../components/ActionBar/create-order-action-bar.jsx";
import CustomUserText from "../components/CustomUserText/CustomUserText.jsx";
import { CURRENCY } from "Utils/constants.jsx";
import { capitalizeFirstLetter, scrollToTop } from "Utils/library.jsx";
import "./Code.scss";

export default function Code({ customUserText, currency, error, isLoading, onChange, onClickContinue, postalCode }) {
  const CANADA = "canada";
  const USA = "usa";
  const country = currency === CURRENCY.CAD ? CANADA : USA;
  const postalCodeText = country === CANADA ? "postal code" : "zip code";
  const inputType = country === CANADA ? "text" : "number";
  const inputLength = country === CANADA ? 6 : 5;

  React.useEffect(() => {
    document.title = `Rent a dumpster | ${capitalizeFirstLetter(postalCodeText)}`;
    scrollToTop();
  }, [postalCodeText]);

  React.useEffect(scrollToTop, [error]);

  function renderErrors() {
    return error && <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: error }} />;
  }

  return (
    <React.Fragment>
      <div className="create-order-code-wrapper">
        <div className="row">
          <label className="control-label create-order__step-label">Enter the delivery {postalCodeText}:</label>
        </div>
        <CustomUserText text={customUserText} />
        {renderErrors()}
        <div className={`row row--${currency}`}>
          <ReactCodeInput
            type={inputType}
            fields={inputLength}
            disabled={isLoading}
            value={postalCode.replace(" ", "")}
            onChange={onChange}
          />
        </div>
        <CreateOrderActionBar loading={isLoading} disabled={false} onClickContinue={onClickContinue} />
      </div>
    </React.Fragment>
  );
}

Code.propTypes = {
  customUserText: PropTypes.string,
  currency: PropTypes.string.isRequired,
  error: PropTypes.string,
  isBackEnd: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClickContinue: PropTypes.func.isRequired,
  postalCode: PropTypes.string,
  usersPhoneNumber: PropTypes.string.isRequired
};

Code.defaultProps = {
  customUserText: "",
  error: "",
  isLoading: false,
  postalCode: ""
};
