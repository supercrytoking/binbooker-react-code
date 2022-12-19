import "jsdom-global/register"; // needed whenever use "mount"
import React from "react";
import expect from "expect";
import { Services } from "./Services.jsx";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import data from "../../../.json-server/db.json";

configure({ adapter: new Adapter() });

// Global mocks to satisfy jest (because of Quill):
global.MutationObserver = class {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
};
global.document.getSelection = function() {};

const servicesData = data.services;

function clickFirstService(wrapper) {
  wrapper
    .find("table tbody tr")
    .at(0)
    .simulate("click");
}

function clickPricingTab(wrapper) {
  wrapper.find("a#servicesTab-tab-pricing").simulate("click");
}

function setFirstZonePrice(wrapper, price) {
  wrapper
    .find('.services__pricing input[type="text"]')
    .at(0)
    .simulate("change", { target: { value: price } });
}

const onSave = jest.fn();
const onDelete = jest.fn();
let wrapper;

describe("<Services />", () => {
  beforeEach(() => {
    wrapper = mount(<Services services={servicesData} onSave={onSave} onDelete={onDelete} />);
  });

  it("should list the number of services that are passed in", () => {
    expect(wrapper.find("table tbody tr").length).toBe(servicesData.length);
  });

  it("should list all of zones that are passed in on the 'Pricing' tab", () => {
    clickFirstService(wrapper);
    clickPricingTab(wrapper);
    expect(wrapper.find(".zone").length).toBe(servicesData[0].zones.length);
  });

  it("should show an error and not fire the callback when you try and save and leave the title blank", () => {
    clickFirstService(wrapper);
    wrapper.find('input[name="title"]').simulate("change", { target: { value: "" } });
    wrapper
      .find(".btn-primary")
      .at(0)
      .simulate("click");
    expect(wrapper.find(".alert-danger").length).toBe(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  it("should show an error and not fire the callback when you try and save a blank price", () => {
    clickFirstService(wrapper);
    clickPricingTab(wrapper);
    setFirstZonePrice(wrapper, "");
    wrapper
      .find(".btn-primary")
      .at(0)
      .simulate("click");
    expect(wrapper.find(".alert-danger").length).toBe(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  it("should show an error and not fire the callback when you try and save an invalid price", () => {
    clickFirstService(wrapper);
    clickPricingTab(wrapper);
    setFirstZonePrice(wrapper, "xxx");
    wrapper
      .find(".btn-primary")
      .at(0)
      .simulate("click");
    expect(wrapper.find(".alert-danger").length).toBe(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  // This is correctly testing, but it is giving a warning about using 'act' and i dont know why (the others dont)
  // https://stackoverflow.com/questions/63365038/react-component-with-usecontext-has-was-not-wrapped-in-act-warning
  it("should not show an error and should fire a callback when click save and all data is valid", () => {
    clickFirstService(wrapper);
    clickPricingTab(wrapper);
    setFirstZonePrice(wrapper, "123");
    wrapper
      .find(".btn-primary")
      .at(0)
      .simulate("click");
    expect(wrapper.find(".alert-danger").length).toBe(0);
    expect(onSave).toHaveBeenCalled();
  });
});
