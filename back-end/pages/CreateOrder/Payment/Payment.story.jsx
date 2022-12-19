import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, select } from "@storybook/addon-knobs";
import moment from "moment";
import Payment from "./Payment.jsx";
import { PaymentContainerWrapper } from "./PaymentContainer.jsx";
import { PAYMENT_METHODS } from "Utils/constants.jsx";

const customer = {
  id: null,
  firstName: "John",
  lastName: "Doe",
  companyName: "Acme Inc.",
  phone: "604-111-2222",
  email: "johndoe@fake.com",
  notes: "",

  deliveryStreet1: "123 Fake Street",
  deliveryCity: "Vancouver",
  deliveryPostalCode: "V7N 7H0",
  deliveryProvince: "BC",
  driverNotes: "Place on the RHS",

  billingStreet1: "222 Another Road",
  billingCity: "Burnaby",
  billingPostalCode: "V4X 3N2",
  billingProvince: "BC",

  stripeId: "abc123"
};

const service = {
  id: 123,
  title: "40 yard bin",
  description: "service desc",
  imagePath: "",
  rentalPrice: 200,
  extraDaysPrice: 25,
  binId: 3
};

const user = {
  stripePublishableKey: "pk_test_i0S5FblMf6CGMwhc5tBHk3Pj",
  phoneNumber: "1-800-123-4567",
  reviewText:
    "Review your order details below, enter your credit card information, then click 'Submit Order' at the bottom of the page to place your order.",
  tax1: 0.05,
  tax1Name: "GST",
  tax2: 0,
  tax2Name: "",
  termsAndConditions:
    "<p>Note that you may not put any of the following items in any of our bins: batteries, paint, tires, appliances, flammable/toxic/hazardous materials, oil, gasoline, animal by-products, or any waste requiring special licenses to transport.Please refer to the city of Calgary landfill website for more info. All Debris will be billed out as per COC Landfill dump designation. One type of designated material only per bin. eg. Drywall, Shingles, Recyclable wood, cardboard. Any designated material with assorted debris will be charged as a whole of that designated material. </p><p><br></p><p>Any weight over 1 tonne will be charged to customer at $120.00 per tonne. Designated material will be charged at $180.00 per tonne </p>",
  defaultPaymentMethod: PAYMENT_METHODS.creditCard
};

const userInvoice = {
  ...user,
  defaultPaymentMethod: PAYMENT_METHODS.invoice
};

const userPreAuth = {
  ...user,
  defaultPaymentMethod: PAYMENT_METHODS.preAuth
};

const commonProps = {
  agreedToTerms: true,
  availableCoupons: [
    { code: "couponOne", value: 10 },
    { code: "couponTwo", value: 16.66 }
  ],
  couponCode: "",
  couponValue: () => {},
  customer,
  dropOffDate: moment(),
  error: "",
  getCouponValue: () => {},
  isLoading: false,
  isBackEnd: true,
  manualDiscount: 5,
  onChangeAgreedToTerms: () => {},
  onChangeCouponCode: () => {},
  onChangeManualDiscount: () => {},
  onChangePaymentMethod: () => {},
  onClickApplyCoupon: () => {},
  onClickBack: () => {},
  onValidContinue: () => {
    alert("submit!");
  },
  paymentMethod: PAYMENT_METHODS.cash,
  pickUpDate: moment(),
  service,
  setError: () => {},
  tax1: 0,
  tax1Name: "",
  tax2: 0,
  tax2Name: "",
  termsAndConditions: "",
  user
};

storiesOf("App Pages/Create Order/Steps", module)
  .addDecorator(withKnobs)
  .add("Payment - Back-end Stripe", () => (
    <PaymentContainerWrapper
      {...commonProps}
      paymentMethod={select(
        "paymentMethod",
        {
          stripe: PAYMENT_METHODS.stripe,
          cc: PAYMENT_METHODS.creditCard,
          cash: PAYMENT_METHODS.cash,
          invoice: PAYMENT_METHODS.invoice
        },
        PAYMENT_METHODS.creditCard
      )}
    />
  ))
  .add("Payment - Back-end Invoice", () => <Payment {...commonProps} isBackEnd user={userInvoice} />)
  .add("Payment - Back-end Pre-auth", () => <Payment {...commonProps} isBackEnd user={userPreAuth} />)
  .add("Payment - Front-end Invoice", () => <Payment {...commonProps} isBackEnd={false} user={userInvoice} />)
  .add("Payment - Front-end Pre-auth", () => <Payment {...commonProps} isBackEnd={false} user={userPreAuth} />);
