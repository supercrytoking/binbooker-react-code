import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import { mount } from "enzyme";
import { LoginApp } from ".";

function enterEmail(wrapper) {
  wrapper.find("#username").simulate("keydown", { which: "joe@fake.com" });
}

function enterPassword(wrapper) {
  wrapper.find("#password").simulate("keydown", { which: "secret" });
}

describe("<LoginApp />", () => {
  const minProps = {
    isDemoAccount: false
  };

  it("should not pre-populate the email address and password for non-demo accounts", () => {
    const wrapper = mount(<LoginApp {...minProps} />);
    expect(wrapper.find("#username").props().value).toEqual("");
    expect(wrapper.find("#password").props().value).toEqual("");
  });

  it("should pre-populate the email address and password for the demo account", () => {
    const wrapper = mount(<LoginApp {...minProps} isDemoAccount />);
    expect(wrapper.find("#username").props().value).toEqual("admin@sampledisposal.com");
    expect(wrapper.find("#password").props().value).toEqual("demo");
  });

  it("should disable the submit button when both are blank", () => {
    const wrapper = mount(<LoginApp {...minProps} />);
    expect(wrapper.find(".btn-primary").props().disabled).toBeTruthy();
  });

  it("should disable the submit button when only email is blank", () => {
    const wrapper = mount(<LoginApp {...minProps} />);
    enterPassword(wrapper);
    expect(wrapper.find(".btn-primary").props().disabled).toBeTruthy();
  });

  it("should disable the submit button when only password is blank", () => {
    const wrapper = mount(<LoginApp {...minProps} />);
    enterEmail(wrapper);
    expect(wrapper.find(".btn-primary").props().disabled).toBeTruthy();
  });

  it("should enable the submit button when both are populated", () => {
    const wrapper = mount(<LoginApp {...minProps} isDemoAccount />);
    expect(wrapper.find(".btn-primary").props().disabled).toBeFalsy();
  });
});
