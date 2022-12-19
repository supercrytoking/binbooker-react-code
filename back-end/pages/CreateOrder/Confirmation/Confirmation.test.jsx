import React from "react";
import expect from "expect";
import { shallow } from "enzyme";
import Confirmation from "./Confirmation.jsx";

describe("<Confirmation />", () => {
  const minProps = {
    companyName: "Sample Dumpster Ltd.",
    companyPhone: "1-800-123-4567",
    companyUrl: "sampledumpster.com",
    companyEmailAddress: "fake@sampledumpster.com",
    customerEmailAddress: "joe@fake.com",
    onClickCreateAnotherOrder: () => {},
    orderId: 11223344
  };

  it("shows order id", () => {
    const wrapper = shallow(<Confirmation {...minProps} />);
    expect(wrapper.html().indexOf(minProps.orderId)).toBeGreaterThan(-1);
  });

  it("shows customer email address", () => {
    const wrapper = shallow(<Confirmation {...minProps} />);
    expect(wrapper.html().indexOf(minProps.customerEmailAddress)).toBeGreaterThan(-1);
  });

  it("shows company name", () => {
    const wrapper = shallow(<Confirmation {...minProps} />);
    expect(wrapper.html().indexOf(minProps.companyName)).toBeGreaterThan(-1);
  });

  it("shows company email address", () => {
    const wrapper = shallow(<Confirmation {...minProps} />);
    expect(wrapper.html().indexOf(minProps.companyEmailAddress)).toBeGreaterThan(-1);
  });

  it("shows company phone number", () => {
    const wrapper = shallow(<Confirmation {...minProps} />);
    expect(wrapper.html().indexOf(minProps.companyPhone)).toBeGreaterThan(-1);
  });

  it('fires a callback when click "create another order" link', () => {
    const mockOnClickCreateAnotherOrder = jest.fn();
    const wrapper = shallow(<Confirmation {...minProps} onClickCreateAnotherOrder={mockOnClickCreateAnotherOrder} />);
    wrapper.find('a[children="create another order"]').simulate("click");
    expect(mockOnClickCreateAnotherOrder).toHaveBeenCalled();
  });
});
