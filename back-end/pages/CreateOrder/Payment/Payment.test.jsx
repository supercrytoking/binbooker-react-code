import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import moment from "moment";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import Payment from "./Payment.jsx";
import { PAYMENT_METHODS } from "Utils/constants.jsx";

configure({ adapter: new Adapter() });

const history = createBrowserHistory();

function PaymentWithRouter(props) {
  return (
    <Router history={history}>
      <Payment {...props} />
    </Router>
  );
}

describe("<Payment />", () => {
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
    handleChangeCode: () => {},
    isLoading: false,
    isBackEnd: true,
    manualDiscount: 0,
    onChangeAgreedToTerms: () => {},
    onChangeManualDiscount: () => {},
    onChangePaymentMethod: () => {},
    onClickBack: () => {},
    onValidContinue: () => {},
    paymentMethod: "cash",
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
    onChangeCouponCode: () => {},
    onSelectCoupon: () => {},
    getCouponValue: () => {},
    couponValue: 0,
    availableCoupons: [{ code: "test", value: 1 }]
  };

  beforeEach(() => {
    // Need to mock this. Doing it in jest.setup.js should work, but is not
    window.scrollTo = jest.fn();
  });

  it("shows custom text if present", () => {
    let testUser = { ...minProps.user };
    testUser.reviewText = "ReviewText";
    const wrapper = mount(<PaymentWithRouter {...minProps} user={testUser} />);
    expect(wrapper.find(".custom-user-text").text()).toEqual(testUser.reviewText);
  });

  it("does not show custom text if not present", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} />);
    expect(wrapper.find(".custom-user-text").length).toEqual(0);
  });

  it("shows error message when provided", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} error="hi" />);
    expect(wrapper.find(".alert-danger").length).toEqual(1);
  });

  it("does not show error when not provided", () => {
    let wrapper = mount(<PaymentWithRouter {...minProps} />);
    expect(wrapper.find(".alert-danger").length).toEqual(0);
  });

  it("shows service title, price, dates, delivery address, billing info (?)", () => {
    let testService = { ...minProps.service };
    testService.rentalPrice = 10;
    testService.extraDaysPrice = 12;

    let testCustomer = { ...minProps.customer };
    testCustomer.deliveryStreet1 = "aaa";
    testCustomer.deliveryCity = "ccc";
    testCustomer.deliveryPostalCode = "180000";
    testCustomer.billingStreet1 = "ddd";
    testCustomer.billingCity = "fff";
    testCustomer.billingPostalCode = "ggg";

    const wrapper = mount(<PaymentWithRouter {...minProps} service={testService} customer={testCustomer} />);
    expect(wrapper.find("[data-qa-id='title']").text()).toEqual("20 yard bin:");
    expect(
      wrapper
        .find("[data-qa-id='extra-days-price']")
        .at(0)
        .text()
    ).toEqual("$12.00");
    expect(wrapper.find(".dates").length).toEqual(1);
  });

  it("shows extra day cost if there is any", () => {
    let testService = { ...minProps.service };
    testService.extraDaysPrice = 10;
    const wrapper = mount(<PaymentWithRouter {...minProps} service={testService} />);
    expect(wrapper.find("[data-qa-id='extra-days-price']").text()).toEqual("$10.00");
  });

  it("does not show extra day cost if there is not any", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} />);
    expect(wrapper.find("[data-qa-id='extra-days-price']").length).toEqual(0);
  });

  it("does not show manual discount field on front-end", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} isBackEnd={false} />);
    expect(wrapper.find("[data-qa-id='expand-manual-discount-prompt']").length).toEqual(0);
  });

  it("does show manual discount field on back-end", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} manualDiscount={10} />);
    expect(wrapper.find("[data-qa-id='manual-discount-value']").text()).toEqual("-$10.00");
  });

  it("shows tax 1 if there is one (name and amount)", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} />);
    expect(wrapper.find("#tax1-total").length).toEqual(1);
  });

  it("does not show tax 1 if there is not one (name and amount)", () => {
    let testUser = { ...minProps.user };
    testUser.tax1 = 0;
    testUser.tax1Name = "";
    const wrapper = mount(<PaymentWithRouter {...minProps} user={testUser} />);
    expect(wrapper.find("#tax1-total").length).toEqual(0);
  });

  it("shows tax 2 if there is one (name and amount)", () => {
    let testUser = { ...minProps.user };
    testUser.tax2Name = "X";
    const wrapper = mount(<PaymentWithRouter {...minProps} user={testUser} />);
    expect(wrapper.find("#tax2-total").length).toEqual(1);
  });

  it("does not show tax 2 if there is not one (name and amount)", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} />);
    expect(wrapper.find("#tax2-total").length).toEqual(0);
  });

  it("does not show 'payment method' field in the front-end", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} isBackEnd={false} />);
    expect(wrapper.find("select[name='paymentMethod']").length).toEqual(0);
  });

  it("does show 'payment method' field in the back-end", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} />);
    expect(wrapper.find("select[name='paymentMethod']").length).toEqual(1);
  });

  // TODO: this test is failing because of stripe
  xit("shows the credit card fields in the front-end", () => {
    const wrapper = mount(
      <PaymentWithRouter {...minProps} isBackEnd={false} paymentMethod={PAYMENT_METHODS.creditCard} />
    );
    expect(wrapper.find(".credit-card-fields").length).toEqual(1);
  });

  // TODO: this test is failing because of stripe
  xit("shows the credit card fields in the back-end if the payment method is 'credit-card'", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} paymentMethod={PAYMENT_METHODS.creditCard} />);
    expect(wrapper.find(".credit-card-fields").length).toEqual(1);
  });

  it("does not shows the credit card fields in the back-end if the payment method is 'cash'", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} paymentMethod={PAYMENT_METHODS.cash} />);
    expect(wrapper.find(".credit-card-fields").length).toEqual(0);
  });

  it("does not shows the credit card fields in the back-end if the payment method is 'invoice'", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} paymentMethod={PAYMENT_METHODS.invoice} />);
    expect(wrapper.find(".credit-card-fields").length).toEqual(0);
  });

  it("does not shows the credit card fields in the back-end if the payment method is 'stripe'", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} paymentMethod={PAYMENT_METHODS.stripe} />);
    expect(wrapper.find(".credit-card-fields").length).toEqual(0);
  });

  it("shows terms if there are any", () => {
    let testUser = { ...minProps.user };
    testUser.termsAndConditions = "something";

    const wrapper = mount(<PaymentWithRouter {...minProps} isBackEnd={false} user={testUser} />);
    expect(wrapper.find("input[type='checkbox']").length).toEqual(1);
  });

  it("does not show terms if there are not any", () => {
    const wrapper = mount(<PaymentWithRouter {...minProps} isBackEnd={false} />);
    expect(wrapper.find("input[type='checkbox']").length).toEqual(0);
  });

  it('fires callback when click "continue" button', () => {
    const mockOnValidContinue = jest.fn();
    const wrapper = mount(<PaymentWithRouter {...minProps} onValidContinue={mockOnValidContinue} />);
    wrapper.find("Button.pending-button").simulate("click");
    expect(mockOnValidContinue).toHaveBeenCalled();
  });

  it('fires callback when click "back" button', () => {
    const mockOnClickBack = jest.fn();
    const wrapper = mount(<PaymentWithRouter {...minProps} onClickBack={mockOnClickBack} />);
    wrapper
      .find("a.btn")
      .first()
      .simulate("click");
    expect(mockOnClickBack).toHaveBeenCalled();
  });

  it("has input for coupon in front-end if they have coupons", () => {
    let wrapper = mount(<PaymentWithRouter {...minProps} isBackEnd={false} />);
    wrapper
      .find('[data-qa-id="expand-coupon-prompt"]')
      .hostNodes()
      .simulate("click");
    expect(wrapper.find(".coupon-code__input").length).toEqual(1);
    expect(wrapper.find(".coupon-code__select").length).toEqual(0);
  });

  it("does not have input for coupon in front-end if they do not have coupons", () => {
    let wrapper = mount(<PaymentWithRouter {...minProps} isBackEnd={false} availableCoupons={[]} />);
    expect(wrapper.find('[data-qa-id="expand-coupon-prompt"]').length).toEqual(0);
    expect(wrapper.find(".coupon-code__input").length).toEqual(0);
    expect(wrapper.find(".coupon-code__select").length).toEqual(0);
  });

  it("has select for coupon in back-end if they have applicable coupons", () => {
    let wrapper = mount(<PaymentWithRouter {...minProps} paymentMethod="cash" />);
    wrapper
      .find('[data-qa-id="expand-coupon-prompt"]')
      .hostNodes()
      .simulate("click");
    expect(wrapper.find(".coupon-code__select").length).toEqual(1);
    expect(wrapper.find(".coupon-code__input").length).toEqual(0);
  });

  it("does not have select for coupon in back-end if they do not have applicable coupons", () => {
    let wrapper = mount(<PaymentWithRouter {...minProps} paymentMethod="cash" availableCoupons={[]} />);
    expect(wrapper.find('[data-qa-id="expand-coupon-prompt"]').length).toEqual(0);
    expect(wrapper.find(".coupon-code__select").length).toEqual(0);
    expect(wrapper.find(".coupon-code__input").length).toEqual(0);
  });
});
