import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import { mount } from "enzyme";
import { ZonesPage } from "./Zones.jsx";

const testZones = [
  { id: 1, name: "zone 1", postalCodes: ["A1A 1A1", "B1B 1B1"] },
  { id: 2, name: "zone 2", postalCodes: [] },
  { id: 3, name: "zone 3", postalCodes: [] }
];

function loadFirstZone(wrapper) {
  wrapper
    .find("tbody tr")
    .at(0)
    .simulate("click");
}

function pressSave(wrapper) {
  wrapper
    .find(".btn-primary")
    .at(0)
    .simulate("click");
}

describe("<ZonesPage />", () => {
  it("should list all of the provided Zones and their postal/zip codes", () => {
    const wrapper = mount(<ZonesPage zones={testZones} onDeleteZone={() => {}} onSaveZone={() => {}} />);
    expect(wrapper.find("tbody tr").length).toBe(testZones.length);
  });

  it("should show the 'Postal Codes' column heading for Canada", () => {
    const wrapper = mount(<ZonesPage zones={testZones} onDeleteZone={() => {}} onSaveZone={() => {}} isCanada />);
    expect(wrapper.find(".zones__postal-codes").text()).toEqual("Postal Codes");
  });

  it("should show the 'Zip Codes' column heading for USA", () => {
    const wrapper = mount(
      <ZonesPage zones={testZones} onDeleteZone={() => {}} onSaveZone={() => {}} isCanada={false} />
    );
    expect(wrapper.find(".zones__postal-codes").text()).toEqual("Zip Codes");
  });

  it("should open the sidepanel when you click on a zone", () => {
    const wrapper = mount(<ZonesPage zones={testZones} onDeleteZone={() => {}} onSaveZone={() => {}} isCanada />);
    expect(wrapper.find(".jk-sidepanel .ant-drawer-title").length).toBe(0);
    loadFirstZone(wrapper);
    expect(wrapper.find(".jk-sidepanel .ant-drawer-title").length).toBe(1);
  });

  it("should open the sidepanel when you click on the 'Create new Zone' button", () => {
    const wrapper = mount(<ZonesPage zones={testZones} onDeleteZone={() => {}} onSaveZone={() => {}} isCanada />);
    expect(wrapper.find(".jk-sidepanel .ant-drawer-title").length).toBe(0);
    wrapper
      .find(".btn-default")
      .at(0)
      .simulate("click");
    expect(wrapper.find(".jk-sidepanel .ant-drawer-title").length).toBe(1);
  });

  it("should show the name of the loaded Zone in the sidepanel", () => {
    const wrapper = mount(<ZonesPage zones={testZones} onDeleteZone={() => {}} onSaveZone={() => {}} isCanada />);
    loadFirstZone(wrapper);
    expect(wrapper.find('input[type="text"]').props().value).toBe(testZones[0].name);
  });

  it("should show the list of the loaded Zone's postal codes in the sidepanel", () => {
    const wrapper = mount(<ZonesPage zones={testZones} onDeleteZone={() => {}} onSaveZone={() => {}} isCanada />);
    loadFirstZone(wrapper);
    testZones[0].postalCodes.forEach(postalCode => {
      expect(wrapper.find("textarea.form-control").props().value).toContain(postalCode);
    });
  });

  it("should show an error if you do not enter a Zone name when press 'Save'", () => {
    const onSaveZone = jest.fn();
    const wrapper = mount(<ZonesPage zones={testZones} onDeleteZone={() => {}} onSaveZone={onSaveZone} isCanada />);
    loadFirstZone(wrapper);
    wrapper.find('input[type="text"]').simulate("change", { target: { value: "" } });
    pressSave(wrapper);
    expect(wrapper.find(".alert-danger")).toBeDefined();
    expect(onSaveZone).not.toHaveBeenCalled();
  });

  // This is not showing an error... because the component isnt programmed to show an error yet
  // IF IT DOESNT SHOW AN ERROR, IT IS SHOWING THE 'ACT()' WARNING (because the thing is called)
  // it.only("should show an error if you enter these two postal codes: 'A1A 1A*' and 'A1A 1A1' and press 'Save'", () => {
  //   const onSaveZone = jest.fn();
  //   const wrapper = mount(<ZonesPage zones={testZones} onDeleteZone={() => {}} onSaveZone={onSaveZone} isCanada />);
  //   loadFirstZone(wrapper);
  //   wrapper.find("textarea.form-control").simulate("change", { target: { value: "A1A 1A*\nA1A 1A1" } });
  //   pressSave(wrapper);
  //   expect(wrapper.find(".alert-danger").length).toBe(1);
  //   expect(onSaveZone).not.toHaveBeenCalled();
  // });

  // xit("should not show an error if you enter these two postal codes: 'A1A 1A*' and 'A1A 1B1' and press 'Save'", () => {});
  // xit("should show an error if you enter the Postal Code '12345' and press 'Save'", () => {});

  // xit("should show an error if you enter these two zip codes: '123**' and '1234*' and press 'Save'", () => {});
  // xit("should not show an error if you enter these two zip codes: '1234*' and '12350' and press 'Save'", () => {});
  // xit("should show an error if you enter the Zip Code 'A1A 1A1' and press 'Save'", () => {});
});
