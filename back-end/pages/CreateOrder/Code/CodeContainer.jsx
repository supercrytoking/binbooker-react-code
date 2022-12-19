import React from "react";
import PropTypes from "prop-types";
import { UserContext } from "../../../UserProvider.jsx";
import { get } from "Utils/services.jsx";
import { isValidPostalCode } from "Utils/library.jsx";
import { CURRENCY } from "Utils/constants.jsx";

import Code from "./Code.jsx";

export default function CodeContainer({ postalCode, isBackEnd, onChange, onValidContinue }) {
  const user = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const postalCodeText = user.currency === CURRENCY.CAD ? "postal code" : "zip code";

  async function isPostalCodeInServiceableArea(postalCode) {
    const response = await get(`/api/v2/pc/${postalCode}`);
    return response && response.covered;
  }

  function setOutsideServiceableAreaError() {
    if (isBackEnd) {
      setError(`This ${postalCodeText} is outside of the serviceable area.`);
    } else {
      setError(
        `Your ${postalCodeText} may not be in our serviceable area. Please call us at <a href="tel:${user.phoneNumber}">${user.phoneNumber}</a> to speak with a customer service representative who would be happy to confirm.`
      );
    }
  }

  function setInvalidError() {
    const properFormat = user.currency === CURRENCY.CAD ? "A1A 1A1" : "12345";
    setError(
      `The ${postalCodeText} you have entered is invalid. Please enter a ${postalCodeText} in the format: ${properFormat}`
    );
  }

  async function handleClickContinue() {
    setIsLoading(true);

    if (isValidPostalCode(postalCode, user.currency)) {
      if (await isPostalCodeInServiceableArea(postalCode)) {
        setError(null);
        setIsLoading(false);
        onValidContinue();
      } else {
        setOutsideServiceableAreaError();
        setIsLoading(false);
      }
    } else {
      setInvalidError();
      setIsLoading(false);
    }
  }

  return (
    <Code
      customUserText={user.cityText}
      currency={user.currency}
      error={error}
      isBackEnd={isBackEnd}
      isLoading={isLoading}
      onChange={onChange}
      onClickContinue={handleClickContinue}
      postalCode={postalCode}
      usersPhoneNumber={user.phoneNumber}
    />
  );
}

CodeContainer.propTypes = {
  postalCode: PropTypes.string,
  isBackEnd: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onValidContinue: PropTypes.func.isRequired
};

CodeContainer.defaultProps = {
  postalCode: "",
  isBackEnd: false
};
