import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import { mount } from "enzyme";
import Address from "./Address.jsx";

describe("<Address />", () => {
  const minProps = {
    order: {
      deliveryAddress: {
        deliveryStreet1: "",
        deliveryCity: "",
        deliveryPostalCode: "",
        deliveryProvince: ""
      },
      notes: "",
      poNumber: ""
    },
    afterSave: () => {},
    currency: "",
    saving: false
  };

  it("has a form", () => {
    let wrapper = mount(<Address {...minProps} />);
    expect(wrapper.find(".form-group").length).toEqual(6);
  });
});
