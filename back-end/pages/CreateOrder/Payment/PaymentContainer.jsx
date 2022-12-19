import React from "react";
import PropTypes from "prop-types";
import { Elements, StripeProvider, injectStripe } from "react-stripe-elements";
import { UserContext } from "../../../UserProvider.jsx";
import { post, get } from "Utils/services.jsx";
import { isValidPoNumber } from "Utils/library.jsx";
import { PAYMENT_METHODS } from "Utils/constants.jsx";
import Payment from "./Payment.jsx";

export function PaymentContainer(props) {
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [availableCoupons, setAvailableCoupons] = React.useState([]);

  async function handleOnValidContinue() {
    if (props.user.termsAndConditions.length > 0 && !props.isBackEnd) {
      if (agreedToTerms) {
        setError("");
      } else {
        setError("You must agree to the Terms and Conditions before you can submit your order.");
        return;
      }
    }

    if (props.paymentMethod === PAYMENT_METHODS.invoice) {
      if (isValidPoNumber(props.poNumber)) {
        setError("");
      } else {
        setError(
          "The PO number may only be up to 16 characters and contain: letters, numbers, dashes, commas and periods."
        );
        return;
      }
    }

    setIsLoading(true);

    let data = {
      postalCode: props.customer.deliveryPostalCode,
      dropOffDate: props.dropOffDate.format("YYYY-MM-DD"),
      pickUpDate: props.pickUpDate ? props.pickUpDate.format("YYYY-MM-DD") : props.pickUpDate,
      serviceId: props.service.id,
      firstName: props.customer.firstName,
      lastName: props.customer.lastName,
      companyName: props.customer.companyName,
      phone: props.customer.phone,
      email: props.customer.email,
      billingStreet1: props.customer.billingStreet1,
      billingCity: props.customer.billingCity,
      billingProvince: props.customer.billingProvince,
      billingPostalCode: props.customer.billingPostalCode,
      notes: props.customer.driverNotes,
      customerNotes: props.customer.notes,
      deliveryStreet1: props.customer.deliveryStreet1,
      deliveryCity: props.customer.deliveryCity,
      deliveryProvince: props.customer.deliveryProvince,
      deliveryPostalCode: props.customer.deliveryPostalCode,
      discountAmount: props.manualDiscount,
      paymentMethod: props.paymentMethod,
      poNumber: props.poNumber,
      couponCode: props.couponCode,
      binId: props.bin ? props.bin.id : null
    };

    switch (props.paymentMethod) {
      case PAYMENT_METHODS.creditCard:
      case PAYMENT_METHODS.preAuth: {
        const response = await props.stripe.createToken({ type: "card" });
        if (response.error) {
          setError(`The following error has occurred: ${response.error.message}`);
          setIsLoading(false);
          return;
        } else {
          setError("");
          data.stripeToken = response.token.id;
        }
        break;
      }
      case PAYMENT_METHODS.stripe:
        data.stripeId = props.customer.stripeId;
        break;
    }

    try {
      const response = await post("/api/v2/orders", data);
      props.onValidContinue(response.orderId);
    } catch (errorMessage) {
      setError(errorMessage);
    }

    setIsLoading(false);
  }

  async function fetchCoupon(code) {
    const pickUpDateString = props.pickupDate ? props.pickUpDate.format("YYYY-MM-DD") : "";

    return await get(
      `/api/v2/coupons?code=${code}&serviceId=${props.service.id}&startDate=${props.dropOffDate.format(
        "YYYY-MM-DD"
      )}&endDate=${pickUpDateString}&postalCode=${props.customer.deliveryPostalCode}`
    );
  }

  async function handleGetCouponValue() {
    if (!props.couponCode) {
      setError("You cannot apply a blank coupon code.");
      return;
    }

    const coupon = await fetchCoupon(props.couponCode);
    setError("");

    if (coupon) {
      props.onClickApplyCoupon(coupon.value);
    } else {
      setError("Unknown coupon code.");
    }
  }

  // When the API is hit from the back-end, if there are coupons, this gets populated with actual coupons.
  // When the API is hit from the front-end, if there are any coupons, this gets populated with a dummy value (so the input appears).
  async function getAvailableCoupons() {
    const pickUpDateString = props.pickupDate ? props.pickUpDate.format("YYYY-MM-DD") : "";

    const couponsResponse = await get(
      `/api/v2/coupons?serviceId=${props.service.id}&startDate=${props.dropOffDate.format(
        "YYYY-MM-DD"
      )}&endDate=${pickUpDateString}&postalCode=${props.customer.deliveryPostalCode}`
    );
    setAvailableCoupons(couponsResponse);
  }

  async function handleSelectCoupon(code) {
    const coupon = await fetchCoupon(code);
    props.onChangeCouponCode(code); // set the code
    props.onClickApplyCoupon(coupon.value); // set the value
  }

  React.useEffect(() => {
    getAvailableCoupons();
  }, []); // do not put getAvailableCoupons as a dependency, or it will indefinitely hit server!

  return (
    <Payment
      {...props}
      agreedToTerms={agreedToTerms}
      error={error}
      setError={setError}
      isLoading={isLoading}
      onChangeAgreedToTerms={setAgreedToTerms}
      onValidContinue={handleOnValidContinue}
      getCouponValue={handleGetCouponValue}
      availableCoupons={availableCoupons}
      onSelectCoupon={handleSelectCoupon}
    />
  );
}

PaymentContainer.propTypes = {};

PaymentContainer.defaultProps = {};

const PaymentComponentWithStripe = injectStripe(PaymentContainer);

export function PaymentContainerWrapper(props) {
  let stripeProps = {};

  if (window.Stripe) {
    stripeProps.apiKey = props.user.stripePublishableKey;
  } else {
    stripeProps.stripe = null; //needed for enzyme tests
  }

  return (
    <StripeProvider {...stripeProps}>
      <Elements>
        <PaymentComponentWithStripe {...props} />
      </Elements>
    </StripeProvider>
  );
}

PaymentContainerWrapper.propTypes = {
  apiKey: PropTypes.string
};

PaymentContainerWrapper.defaultProps = {
  apiKey: "null"
};

export default function PaymentContainerWrapperWrapper(props) {
  const user = React.useContext(UserContext);

  return <PaymentContainerWrapper {...props} user={user} />;
}
