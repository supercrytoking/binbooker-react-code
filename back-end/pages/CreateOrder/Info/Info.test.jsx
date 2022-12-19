import "jsdom-global/register"; // needed whenever use "mount"
import React from "react";
import expect from "expect";
import { mount } from "enzyme";
import Info from "./Info.jsx";

describe("<Info />", () => {
  const minProps = {
    children: null,
    currency: "CAD",
    customer: {},
    customUserText: "",
    errors: [],
    isBackEnd: false,
    isSameChecked: false,
    onChange: () => {},
    onClickBack: () => {},
    onClickIsSame: () => {},
    onValidContinue: () => {}
  };

  beforeEach(() => {
    // Need to mock this. Doing it in jest.setup.js should work, but is not
    window.scrollTo = jest.fn();
  });

  it("shows custom text if present", () => {
    const customUserText = "CustomUserText";
    const wrapper = mount(<Info {...minProps} customUserText={customUserText} />);
    expect(wrapper.find(".custom-user-text").text()).toEqual(customUserText);
  });

  it("does not show custom text if not present", () => {
    const wrapper = mount(<Info {...minProps} />);
    expect(wrapper.find(".custom-user-text").length).toEqual(0);
  });

  it("populates customer info on screen when a customer is pre-loaded", () => {
    const testInfo = {
      companyName: "Acme"
    };
    const wrapper = mount(<Info {...minProps} customer={testInfo} />);
    expect(wrapper.find("input[name='companyName']").props().value).toEqual(testInfo.companyName);
  });

  it("fires a callback when changing input fields", () => {
    const mockOnChange = jest.fn();
    const wrapper = mount(<Info {...minProps} onChange={mockOnChange} />);
    wrapper.find("input[name='companyName']").simulate("change", { target: { value: "Acme Inc." } });
    wrapper.find("select[name='deliveryProvince']").simulate("change", { target: { value: "ON" } });
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  xit("does not show search box on front-end", () => {});
  xit("does show search box on back-end", () => {});

  it("shows an error when supplied", () => {
    const errors = ["whatever"];
    const wrapper = mount(<Info {...minProps} errors={errors} />);
    expect(wrapper.find(".create-order__info__errors").length).toEqual(1);
  });

  it("does not show error when not supplied", () => {
    const wrapper = mount(<Info {...minProps} />);
    expect(wrapper.find(".create-order__info__errors").length).toEqual(0);
  });

  it("fires callback when click 'isSame'", () => {
    const mockOnClickIsSame = jest.fn();
    const wrapper = mount(<Info {...minProps} onClickIsSame={mockOnClickIsSame} />);
    wrapper.find("input[type='checkbox']").simulate("change");
    expect(mockOnClickIsSame).toHaveBeenCalled();
  });

  it("does not show delivery fields when 'isSame' is checked", () => {
    const wrapper = mount(<Info {...minProps} isSameChecked />);
    expect(wrapper.find(".delivery-address--is-same").length).toEqual(1);
  });

  it("shows delivery fields when 'isSame' is not checked", () => {
    const wrapper = mount(<Info {...minProps} />);
    expect(wrapper.find(".delivery-address--is-same").length).toEqual(0);
  });

  xit("copies values into delivery address when click 'isSame'", () => {});

  it("does not show 'customer notes' field in front-end", () => {
    const wrapper = mount(<Info {...minProps} />);
    expect(wrapper.find("[htmlFor='customerNotes']").length).toEqual(0);
  });

  it("does show 'customer notes' field in back-end", () => {
    const wrapper = mount(<Info {...minProps} isBackEnd />);
    expect(wrapper.find("[htmlFor='customerNotes']").length).toEqual(1);
  });

  it("pre-populates with user's province", () => {
    const testCustomer = { billingProvince: "BC" };
    const wrapper = mount(<Info {...minProps} customer={testCustomer} />);
    expect(wrapper.find("select[name='billingProvince']").props().defaultValue).toEqual("BC");
  });

  it("shows 'postal code' for Canada", () => {
    const wrapper = mount(<Info {...minProps} />);
    expect(wrapper.find("[htmlFor='billingPostalCode']").text()).toEqual("Postal Code*");
  });

  it("shows 'zip code' for USA", () => {
    const testCurrency = "USD";
    const wrapper = mount(<Info {...minProps} currency={testCurrency} />);
    expect(wrapper.find("[htmlFor='billingPostalCode']").text()).toEqual("Zip Code*");
  });

  it("shows provinces for Canadian company", () => {
    const wrapper = mount(<Info {...minProps} />);
    expect(
      wrapper
        .find("select")
        .first()
        .find("option")
        .first()
        .html()
        .indexOf("Alberta")
    ).toBeGreaterThan(-1);
  });

  it("shows states for American company", () => {
    const wrapper = mount(<Info {...minProps} currency="USD" />);
    expect(
      wrapper
        .find("select")
        .first()
        .find("option")
        .first()
        .html()
        .indexOf("Alabama")
    ).toBeGreaterThan(-1);
  });

  it('fires a callback when click "continue"', () => {
    const mockOnValidContinue = jest.fn();
    const wrapper = mount(<Info {...minProps} onValidContinue={mockOnValidContinue} />);
    wrapper
      .find(".btn-primary")
      .first()
      .simulate("click");
    expect(mockOnValidContinue).toHaveBeenCalled();
  });

  it('fires a callback when press "back"', () => {
    const mockOnClickBack = jest.fn();
    const wrapper = mount(<Info {...minProps} onClickBack={mockOnClickBack} />);
    wrapper
      .find("a.btn")
      .first()
      .simulate("click");
    expect(mockOnClickBack).toHaveBeenCalled();
  });
});
