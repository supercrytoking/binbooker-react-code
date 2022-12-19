import "jsdom-global/register"; // needed whenever use "mount"
import React from "react";
import expect from "expect";
import { mount } from "enzyme";
import QuickBooks from "./QuickBooks.jsx";

describe("<QuickBooks />", () => {
  const backedUpWindowLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = new URL("http://sample.binbooker.test");
  });

  afterAll(() => {
    window.location = backedUpWindowLocation;
  });

  it("shows proper message when invalid domain", () => {
    window.location = new URL("http://invalid.binbooker.test");
    const wrapper = mount(<QuickBooks qbAccessToken="abc" qbIsSyncing />);
    expect(wrapper.text()).toContain("This new feature is currently only available upon request");
  });

  it("shows proper message when not connected", () => {
    const wrapper = mount(<QuickBooks qbAccessToken="" qbIsSyncing={false} />);
    expect(wrapper.text()).toContain("By enabling this feature BinBooker will");
  });

  it("shows proper message when connected and enabled", () => {
    const wrapper = mount(<QuickBooks qbAccessToken="abc" qbIsSyncing />);
    expect(wrapper.text()).toContain(
      "Transaction and customer data is automatically being sent to QuickBooks Online in real-time."
    );
  });

  it("shows proper message when connected and not enabled", () => {
    const wrapper = mount(<QuickBooks qbAccessToken="abc" qbIsSyncing={false} />);
    expect(wrapper.text()).toContain("BinBooker is linked to QuickBooks Online, but not enabled");
  });
});
