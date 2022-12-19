import React from "react";
import expect from "expect";
import { shallow } from "enzyme";
import Code from "./Code.jsx";
import CustomUserText from "../components/CustomUserText/CustomUserText.jsx";

describe("<Code />", () => {
  let minProps = {
    customUserText: "",
    currency: "",
    error: "",
    isBackEnd: false,
    isLoading: false,
    onChange: () => {},
    onClickContinue: () => {},
    postalCode: "",
    usersPhoneNumber: ""
  };
  let code;
  it("shows custom text if present", () => {
    code = shallow(<Code {...minProps} customUserText="test" />);
    expect(code.find(CustomUserText).props().text).toBe("test");
  });
  it("does not show custom text if not present", () => {
    code = shallow(<Code {...minProps} />);
    expect(code.find(CustomUserText).props().text).toBe("");
  });
  it("shows error when provided", () => {
    code = shallow(<Code {...minProps} error="test" />);
    expect(code.find(".alert.alert-danger").length).toBe(1);
    expect(code.find(".alert.alert-danger").props().dangerouslySetInnerHTML.__html).toBe("test");
  });
  it("does not show error when not provided", () => {
    code = shallow(<Code {...minProps} />);
    expect(code.find(".alert.alert-danger").length).toBe(0);
  });
  it("shows proper term for canada", () => {
    code = shallow(<Code {...minProps} currency="CAD" />);
    expect(code.find(".control-label").props().children[1]).toBe("postal code");
  });
  it("shows proper term for usa", () => {
    code = shallow(<Code {...minProps} currency="USD" />);
    expect(code.find(".control-label").props().children[1]).toBe("zip code");
  });
  /*it("fires callback when click 'continue'", () => {});
    I think that this test must be in <CreateOrderActionBar />
    Actually shallow isn't supporting event propagation
    https://github.com/airbnb/enzyme/blob/master/docs/future.md
  */
});
