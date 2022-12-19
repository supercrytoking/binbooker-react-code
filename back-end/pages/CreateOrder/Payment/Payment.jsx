import React from "react";
import PropTypes from "prop-types";
import momentPropTypes from "react-moment-proptypes";
import { Popover } from "react-bootstrap";
import { Link } from "react-router-dom";
import CreditCardFormSection from "Components/CreditCardFormSection";
import PaymentMethodFormSection from "Components/PaymentMethodFormSection";
import { formatDollarAmount, scrollToTop } from "Utils/library.jsx";
import { PAYMENT_METHODS } from "Utils/constants.jsx";
import CustomUserText from "../components/CustomUserText/CustomUserText.jsx";
import CreateOrderActionBar from "../components/ActionBar/create-order-action-bar.jsx";
import CouponLine from "./components/CouponLine";
import ManualDiscountLine from "./components/ManualDiscountLine";
import CouponPrompt from "./components/CouponPrompt";
import ManualDiscountPrompt from "./components/ManualDiscountPrompt";
import "./Payment.scss";

// TODO: the "edit" links in this need to be disabled when its loading. To do that I should be using Buttons instead of Links, and would need react-router's history.

export default function Payment({
  isBackEnd,
  isLoading,
  error,
  user,
  customer,
  service,
  bin,
  dropOffDate,
  pickUpDate,
  manualDiscount,
  availableCoupons,
  couponCode,
  couponValue,
  paymentMethod,
  poNumber,
  agreedToTerms,
  onChangePaymentMethod,
  onChangePoNumber,
  onChangeAgreedToTerms,
  onChangeManualDiscount,
  onClickBack,
  onValidContinue,
  onSelectCoupon
}) {
  const [tax1Amount, setTax1Amount] = React.useState(0);
  const [tax2Amount, setTax2Amount] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const isFrontEnd = !isBackEnd;
  const loadedCustomerHasStripeProfile = customer.stripeId !== "";

  React.useEffect(() => {
    document.title = `Rent a dumpster | Review & Pay`;
    scrollToTop();
  }, []);

  React.useEffect(() => {
    const t1amount = calculateTax(service.rentalPrice, service.extraDaysPrice, manualDiscount, couponValue, user.tax1);
    const t2amount = calculateTax(service.rentalPrice, service.extraDaysPrice, manualDiscount, couponValue, user.tax2);
    setTax1Amount(t1amount);
    setTax2Amount(t2amount);
    setTotal(
      calculateTotal(service.rentalPrice, service.extraDaysPrice, manualDiscount, couponValue, t1amount, t2amount)
    );
  }, [user.tax1, user.tax2, manualDiscount, couponValue]);

  React.useEffect(() => {
    if (error) {
      scrollToTop();
    }
  }, [error]);

  function calculateTax(rentalPrice, extraDaysPrice, manualDiscount, couponValue, taxRate) {
    return +((rentalPrice + extraDaysPrice - manualDiscount - couponValue) * taxRate).toFixed(2);
  }

  function calculateTotal(rentalPrice, extraDaysPrice, manualDiscount, couponValue, tax1, tax2) {
    return rentalPrice + extraDaysPrice - manualDiscount - couponValue + tax1 + tax2;
  }

  function setPaymentMethod(paymentMethod) {
    onChangePaymentMethod(paymentMethod);
  }

  function setPoNumber(poNumber) {
    onChangePoNumber(poNumber);
  }

  function renderSampleCreditCardPopover() {
    if (window.location.host.indexOf("sample.binbooker.") > -1) {
      return (
        <Popover id="credit-card-helper-popover" placement="top">
          Enter the test credit card number "4242 4242 4242 4242".
        </Popover>
      );
    }
    return null;
  }

  function renderCreditCardFields() {
    switch (paymentMethod) {
      case PAYMENT_METHODS.creditCard:
      case PAYMENT_METHODS.preAuth:
        return (
          <div className="credit-card-fields">
            {renderSampleCreditCardPopover()}
            <CreditCardFormSection isDisabled={isLoading} />
          </div>
        );
      default:
        return null;
    }
  }

  function renderTax1() {
    if (user.tax1Name) {
      return (
        <div className="row">
          <label className="pricing-left control-label italic">{user.tax1Name}:</label>
          <div className="pricing-right italic" id="tax1-total">
            {formatDollarAmount(tax1Amount)}
          </div>
        </div>
      );
    }
  }

  function renderTax2() {
    if (user.tax2Name) {
      return (
        <div className="row">
          <label className="pricing-left control-label italic">{user.tax2Name}:</label>
          <div className="pricing-right italic" id="tax2-total">
            {formatDollarAmount(tax2Amount)}
          </div>
        </div>
      );
    }
  }

  function renderAddress(street1, city, province, postalCode) {
    const html = [];
    html.push(
      <div key={1} data-qa-id="street1">
        {street1}
      </div>
    );
    html.push(
      <div key={3} data-qa-id="city-province-postal">
        {city}, {province}&nbsp;&nbsp;{postalCode}
      </div>
    );
    return html;
  }

  function renderPaymentMethodFormSection() {
    if (isFrontEnd) {
      return null;
    }

    return (
      <PaymentMethodFormSection
        onChange={setPaymentMethod}
        paymentMethod={paymentMethod}
        onChangePoNumber={setPoNumber}
        poNumber={poNumber}
        allowPreAuth={!loadedCustomerHasStripeProfile}
        allowStripe={loadedCustomerHasStripeProfile}
        isDisabled={isLoading}
      />
    );
  }

  function renderPaymentMethod() {
    if (isFrontEnd && paymentMethod === PAYMENT_METHODS.invoice) {
      return <p>We will contact you to arrange payment.</p>;
    }

    return (
      <div className="payment-method-wrapper">
        {renderPaymentMethodFormSection()}
        {renderCreditCardFields()}
      </div>
    );
  }

  function renderBillingInfo() {
    const companyName = customer.companyName ? <div>{customer.companyName}</div> : null;
    return (
      <div>
        {companyName}
        {customer.firstName} {customer.lastName}
        {renderAddress(
          customer.billingStreet1,
          customer.billingCity,
          customer.billingProvince,
          customer.billingPostalCode
        )}
        {customer.phone}
        <br />
        {customer.email}
      </div>
    );
  }

  function renderTerms() {
    if (!user.termsAndConditions.length) {
      return null;
    }

    if (isBackEnd) {
      return (
        <div className="row">
          <div className="terms-and-conditions-wrapper">
            <h4>Terms and conditions</h4>
            <div className="terms-and-conditions" dangerouslySetInnerHTML={{ __html: user.termsAndConditions }} />
          </div>
        </div>
      );
    }

    return (
      <div className="col-sm-12 no-padding">
        <label>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={() => onChangeAgreedToTerms(!agreedToTerms)}
            disabled={isLoading}
          />
          &nbsp; I have read and agree to the&nbsp;
          <a href="terms-and-conditions.php" target="_blank">
            Terms and Conditions
          </a>
        </label>
      </div>
    );
  }

  function renderError() {
    if (error.length > 0) {
      return <div className="alert alert-danger">{error}</div>;
    }

    return null;
  }

  function renderDriverNotes() {
    return customer.driverNotes.length > 0 ? <div className="driver-notes">Notes: {customer.driverNotes}</div> : null;
  }

  function renderDeliveryAddress() {
    const addressesAreTheSame =
      customer.deliveryStreet1 === customer.billingStreet1 &&
      customer.deliveryCity === customer.billingCity &&
      customer.deliveryPostalCode === customer.billingPostalCode &&
      customer.deliveryProvince === customer.billingProvince;

    return addressesAreTheSame ? (
      <div>Same as billing address</div>
    ) : (
      renderAddress(
        customer.deliveryStreet1,
        customer.deliveryCity,
        customer.deliveryProvince,
        customer.deliveryPostalCode
      )
    );
  }

  function renderExtraDaysPrice() {
    if (service.extraDaysPrice === 0) {
      return null;
    }

    return (
      <div className="row">
        <label className="pricing-left control-label italic">Extra days:</label>
        <div className="pricing-right italic" data-qa-id="extra-days-price">
          {formatDollarAmount(service.extraDaysPrice)}
        </div>
      </div>
    );
  }

  function renderPrice() {
    const binForeignId = bin ? ` (${bin.foreignId})` : "";
    const title = `${service.title}${binForeignId}`;

    return (
      <div className="pricing">
        <div className="row">
          <label className="pricing-left control-label italic" data-qa-id="title">
            {title}:
          </label>
          <div className="pricing-right italic">{formatDollarAmount(service.rentalPrice)}</div>
        </div>
        {renderExtraDaysPrice()}
        {couponValue > 0 && (
          <CouponLine
            amount={couponValue}
            couponCode={couponCode}
            onClickRemove={() => {
              onSelectCoupon("");
            }}
          />
        )}
        {isBackEnd && manualDiscount !== 0 && (
          <ManualDiscountLine
            amount={manualDiscount}
            onClickRemove={() => {
              onChangeManualDiscount(0);
            }}
          />
        )}
        {renderTax1()}
        {renderTax2()}
        <div className="row">
          <label className="pricing-left control-label">Total:</label>
          <div className="pricing-right grand-total" id="grand-total">
            {formatDollarAmount(total)}
          </div>
        </div>
        {couponValue === 0 && (
          <CouponPrompt
            isDisabled={isLoading}
            availableCoupons={availableCoupons}
            isBackEnd={isBackEnd}
            onApplyCoupon={onSelectCoupon}
          />
        )}
        {isBackEnd && manualDiscount === 0 && (
          <ManualDiscountPrompt isDisabled={isLoading} onApplyManualDiscount={onChangeManualDiscount} />
        )}
      </div>
    );
  }

  return (
    <div className="create-order-payment">
      <div className="row">
        <label className="control-label create-order__step-label">Review and submit:</label>
      </div>
      <CustomUserText text={user.reviewText} />
      {renderError()}
      <div className="row">
        <div className="col-sm-6 main-panel">
          <div className="row">
            <h4>Service</h4>
            <div>
              {service.title}
              <Link className="edit-link" to="service">
                edit
              </Link>
            </div>
            <div className="dates">
              {dropOffDate.format("ddd. MMM. D, YYYY")} &rarr;{" "}
              {pickUpDate ? pickUpDate.format("ddd. MMM. D, YYYY") : "TBD"}
              <Link className="edit-link" to="service">
                edit
              </Link>
            </div>
          </div>
          <div className="row">
            <h4>
              Billing Information
              <Link className="edit-link" to="info">
                edit
              </Link>
            </h4>
            {renderBillingInfo()}
          </div>
          <div className="row">
            <h4>
              Deliver To
              <Link className="edit-link" to="info">
                edit
              </Link>
            </h4>
            {renderDeliveryAddress()}
            {renderDriverNotes()}
          </div>
        </div>
        <div className="col-sm-6 side-panel">
          <h4>Price</h4>
          {renderPrice()}
        </div>
      </div>
      <hr />
      <div className="row">
        <h4>Payment</h4>
        {renderPaymentMethod()}
        {renderTerms()}
      </div>
      <CreateOrderActionBar
        primaryButtonText="Submit Order"
        primaryButtonPendingText="Submitting..."
        onClickContinue={onValidContinue}
        onClickBack={onClickBack}
        loading={isLoading}
      />
    </div>
  );
}

Payment.propTypes = {
  agreedToTerms: PropTypes.bool,
  bin: PropTypes.shape({ id: PropTypes.string, foreignId: PropTypes.string }),
  customer: PropTypes.object.isRequired,
  dropOffDate: momentPropTypes.momentObj.isRequired,
  error: PropTypes.string,
  setError: PropTypes.func,
  isLoading: PropTypes.bool,
  isBackEnd: PropTypes.bool.isRequired,
  manualDiscount: PropTypes.number,
  onChangeAgreedToTerms: PropTypes.func.isRequired,
  onChangeManualDiscount: PropTypes.func.isRequired,
  onChangePaymentMethod: PropTypes.func.isRequired,
  onChangePoNumber: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  onValidContinue: PropTypes.func.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  poNumber: PropTypes.string,
  pickUpDate: momentPropTypes.momentObj,
  service: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  //Coupon
  couponCode: PropTypes.string,
  onChangeCouponCode: PropTypes.func.isRequired,
  getCouponValue: PropTypes.func.isRequired,
  couponValue: PropTypes.number.isRequired,
  availableCoupons: PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string, value: PropTypes.number })) // populated when on back-end. for front-end, it will have a dummy value so the input appears
};

Payment.defaultProps = {
  agreedToTerms: false,
  bin: null,
  error: "",
  manualDiscount: 0,
  availableCoupons: [],
  poNumber: "",
  pickUpDate: null
};
