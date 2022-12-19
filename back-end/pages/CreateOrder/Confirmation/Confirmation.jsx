import React from "react";
import PropTypes from "prop-types";
import CustomUserText from "../components/CustomUserText/CustomUserText.jsx";
import { scrollToTop } from "Utils/library.jsx";
import { PAYMENT_METHODS } from "Utils/constants.jsx";

export default function Confirmation({
  companyName,
  companyPhone,
  companyUrl,
  companyEmailAddress,
  customerEmailAddress,
  customUserText,
  onClickCreateAnotherOrder,
  paymentMethod,
  orderId
}) {
  React.useEffect(() => {
    document.title = `Rent a dumpster | Confirmation`;
    scrollToTop();
  }, []);

  return (
    <div className="create-order__confirmation">
      <h3>Order Created!</h3>
      <CustomUserText text={customUserText} />
      <p>
        Thank you for ordering with {companyName}.
        {paymentMethod === PAYMENT_METHODS.cash ||
        paymentMethod === PAYMENT_METHODS.invoice ||
        paymentMethod === PAYMENT_METHODS.preAuth
          ? " Your order has been created."
          : " Your order has been created and the credit card has been charged."}
      </p>
      <p>
        The order number is: {orderId}. A confirmation email has been sent to {customerEmailAddress} and should arrive
        shortly. The email will be from info@binbooker.com - if you do not see the email in your inbox after five
        minutes, be sure to check your spam folder.
      </p>
      <p>
        If you have any questions about your order, please contact {companyName} by phone (
        <a href={`tel:${companyPhone}`}>{companyPhone}</a>) or email (
        <a href={`mailto:${companyEmailAddress}`}>{companyEmailAddress}</a>).
      </p>
      <p>
        You can now <a href={companyUrl}>return to the {companyName} website</a> or{" "}
        <a href="#" onClick={onClickCreateAnotherOrder}>
          create another order
        </a>
        .
      </p>
    </div>
  );
}

Confirmation.propTypes = {
  companyName: PropTypes.string.isRequired,
  companyEmailAddress: PropTypes.string.isRequired,
  companyPhone: PropTypes.string.isRequired,
  companyUrl: PropTypes.string.isRequired,
  customerEmailAddress: PropTypes.string.isRequired,
  onClickCreateAnotherOrder: PropTypes.func.isRequired,
  orderId: PropTypes.number.isRequired
};
