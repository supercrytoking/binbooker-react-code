import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import { mount } from "enzyme";
import DeleteModal from ".";

describe("<DeleteModal />", () => {
  const minProps = {
    subjectName: "Bin",
    onClose: () => {},
    onDelete: () => {},
    isVisible: true,
    isPending: false
  };

  it("it should shows proper subject in heading", () => {
    let wrapper = mount(<DeleteModal {...minProps} />);
    expect(
      wrapper
        .find(".modal-header")
        .find("h4")
        .text()
    ).toMatch(/Bin/);
  });

  it("it should shows proper subject in body", () => {
    let wrapper = mount(<DeleteModal {...minProps} />);
    expect(
      wrapper
        .find(".modal-body")
        .find("p")
        .text()
    ).toMatch(/Bin/);
  });

  const mockCallback = jest.fn();
  it("it should fire onDelete callback when click submit", () => {
    let wrapper = mount(<DeleteModal {...minProps} onDelete={mockCallback} />);
    wrapper
      .find(".modal-footer")
      .find("button")
      .simulate("click");
    expect(mockCallback).toHaveBeenCalled();
  });

  it("it should fire onClose callback when click 'x'", () => {
    let wrapper = mount(<DeleteModal {...minProps} onClose={mockCallback} />);
    wrapper
      .find(".modal-header")
      .find("button.close")
      .simulate("click");
    expect(mockCallback).toHaveBeenCalled();
  });

  it("it should disable button when click the delete button", () => {
    let wrapper = mount(<DeleteModal {...minProps} isPending />);
    wrapper
      .find(".modal-footer")
      .find("button")
      .simulate("click");
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
