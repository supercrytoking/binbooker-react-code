import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import moment from "moment";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { PaymentContainerWrapperWrapper } from "./PaymentContainer.jsx";
import { PAYMENT_METHODS } from "Utils/constants.jsx";

configure({ adapter: new Adapter() });

const history = createBrowserHistory();

function PaymentContainerWrapperWithRouter(props) {
  return (
    <Router history={history}>
      <PaymentContainerWrapperWrapper {...props} />
    </Router>
  );
}

describe("<PaymentContainerWrapperWrapper />", () => {
  const minProps = {
    agreedToTerms: false,
    customer: {
      id: null,
      firstName: "John",
      lastName: "Doe",
      companyName: "",
      phone: "111-222-3333",
      email: "john@fake.com",
      notes: "",

      deliveryStreet1: "",
      deliveryCity: "",
      deliveryPostalCode: "",
      deliveryProvince: "ON",
      driverNotes: "",

      billingStreet1: "",
      billingCity: "",
      billingPostalCode: "",
      billingProvince: "ON",

      stripeId: ""
    },
    dropOffDate: moment(),
    error: "",
    isLoading: false,
    isBackEnd: false,
    manualDiscount: 0,
    onChangeAgreedToTerms: () => { },
    onChangeManualDiscount: () => { },
    onChangePaymentMethod: () => { },
    onClickBack: () => { },
    onValidContinue: () => { },
    paymentMethod: "credit-card",
    pickUpDate: moment().add(1, "days"),
    service: {
      id: null,
      title: "20 yard bin",
      description: "Bin bin",
      imagePath: "",
      rentalPrice: 0,
      extraDaysPrice: 0,
      binId: 1
    },
    user: {
      cityText: "",
      companyName: "",
      confirmationText: "",
      dateText: "",
      email: "",
      infoText: "",
      logoPath: "",
      phoneNumber: "",
      reviewText: "",
      serviceText: "",
      showHeader: false,
      stripePublishableKey: "",
      tax1: 8,
      tax1Name: "GST",
      tax2: 0,
      tax2Name: "",
      termsAndConditions: "",
      url: ""
    },
    //Coupon
    couponCode: "",
    onChangeCouponCode: () => { },
    getCouponValue: () => { },
    couponValue: 0,
    availableCoupons: [{ code: "test", value: 1 }]
  };

  beforeEach(() => {
    // Need to mock this. Doing it in jest.setup.js should work, but is not
    window.scrollTo = jest.fn();
  });

  it("shows credit card fields when paying with credit card", () => {
    let wrapper = mount(<PaymentContainerWrapperWithRouter {...minProps} />);
    expect(wrapper.find(".credit-card-fields").length).toEqual(1);
  });

  it("doesnt show credit card fields when paying with stripe", () => {
    let propsCopy = Object.assign({}, minProps);
    propsCopy.customer.stripeId = "abc123";
    propsCopy.paymentMethod = PAYMENT_METHODS.stripe;

    let wrapper = mount(<PaymentContainerWrapperWithRouter {...propsCopy} />);
    expect(wrapper.find(".credit-card-fields").length).toEqual(0);
  });

  it("doesnt show credit card fields when paying with cash", () => {
    let wrapper = mount(<PaymentContainerWrapperWithRouter {...minProps} paymentMethod={PAYMENT_METHODS.cash} />);
    expect(wrapper.find(".credit-card-fields").length).toEqual(0);
  });

  it("doesnt show credit card fields when paying with invoice", () => {
    let wrapper = mount(<PaymentContainerWrapperWithRouter {...minProps} paymentMethod={PAYMENT_METHODS.invoice} />);
    expect(wrapper.find(".credit-card-fields").length).toEqual(0);
  });

  it("shows/hides taxes as necessary", () => {
    let wrapper = mount(<PaymentContainerWrapperWithRouter {...minProps} />);
    expect(wrapper.find("#tax1-total").length).toEqual(1);
    expect(wrapper.find("#tax2-total").length).toEqual(0);
  });
});
