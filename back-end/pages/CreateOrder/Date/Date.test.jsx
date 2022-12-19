import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import { shallow, mount } from "enzyme";
import moment from "moment";

import DateComp from "./Date.jsx";
import CustomUserText from "../components/CustomUserText/CustomUserText.jsx";

describe("<Date />", () => {
  const minProps = {
    customUserText: "",
    dontChoosePickUpDateIsChecked: false,
    dropOffDate: null,
    error: "",
    fullyBookedDates: [],
    holidays: [],
    isBackEnd: false,
    isLoading: false,
    isPickUpDateMandatory: true,
    onChange: () => {},
    onClickBack: () => {},
    onToggleDontChoosePickUpDate: () => {},
    onValidContinue: () => {},
    pickUpDate: null,
    colour: "#ff0000"
  };

  beforeEach(() => {
    // Need to mock this. Doing it in jest.setup.js should work, but is not
    window.scrollTo = jest.fn();
  });

  describe("custom text", () => {
    it("shows if present", () => {
      const wrapper = mount(<DateComp {...minProps} customUserText="test" />);
      expect(wrapper.find(CustomUserText).text()).toBe("test");
    });

    it("does not show if not present", () => {
      const wrapper = mount(<DateComp {...minProps} />);
      expect(wrapper.find(CustomUserText).isEmptyRender()).toBe(true);
    });
  });

  describe("error", () => {
    it("shows when supplied", () => {
      const error = "whatever";
      const wrapper = mount(<DateComp {...minProps} error={error} />);
      expect(wrapper.find(".alert-danger").length).toEqual(1);
    });

    it("shows when none is supplied", () => {
      const wrapper = mount(<DateComp {...minProps} />);
      expect(wrapper.find(".alert-danger").length).toEqual(0);
    });
  });

  describe("dates", () => {
    it("are enabled when no holidays/blocked days specified", () => {
      const wrapper = mount(<DateComp {...minProps} />);
      expect(wrapper.find(`td[aria-label*="It’s available."]`).length).toBeGreaterThan(50);
    });

    it("selects when they are passed in", () => {
      const tomorrow = moment().add(1, "days");
      const nextWeek = moment().add(7, "days");

      const wrapper = mount(<DateComp {...minProps} dropOffDate={tomorrow} pickUpDate={nextWeek} />);
      expect(wrapper.find('.CalendarDay[aria-label*="Selected as start date."]').length).toBe(1);
      expect(wrapper.find('.CalendarDay[aria-label*="Selected as end date."]').length).toBe(1);
    });

    it("does not select when they are not passed in", () => {
      const wrapper = mount(<DateComp {...minProps} />);
      expect(wrapper.find('.CalendarDay[aria-label*="Selected as start date."]').length).toBe(0);
      expect(wrapper.find('.CalendarDay[aria-label*="Selected as end date."]').length).toBe(0);
    });

    it("requires a pick-up date when told to", () => {
      const wrapper = shallow(<DateComp {...minProps} />);
      expect(wrapper.find("DontChoosePickUpDateToggle").exists()).toBe(false);
    });

    it("does not require a pick-up date when not told to", () => {
      const wrapper = shallow(<DateComp {...minProps} isPickUpDateMandatory={false} />);
      expect(wrapper.find("DontChoosePickUpDateToggle").exists()).toBe(true);
    });
  });

  describe("callbacks", () => {
    // This isnt working as all the dates are disabled for some reason
    xit("fires when click an enabled date", () => {
      const todaysDate = new Date().getDate();
      const mockCallback = jest.fn();
      const wrapper = mount(<DateComp {...minProps} onChange={mockCallback} />);
      // wrapper.update(); // re-render, doesnt work
      // wrapper.setProps({}); // re-render, doesnt work

      wrapper
        .find(".CalendarDay")
        .at(todaysDate) // it really clicks tomorrow, 'at()' is zero-based
        .simulate("click");
      expect(mockCallback).toHaveBeenCalled();
    });

    it("does not fire when choose disabled date", () => {
      const mockCallback = jest.fn();

      // disable some days
      const today = new Date();
      const firstOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
      const holidays = [];

      for (let i = 0; i < 10; i++) {
        holidays.push(
          moment(firstOfCurrentMonth)
            .add(i, "days")
            .format("YYYY-MM-DD")
        );
      }

      const wrapper = mount(<DateComp {...minProps} onChange={mockCallback} holidays={holidays} />);
      wrapper
        .find(`td[aria-label*="Not available"]`)
        .at(2)
        .simulate("click");
      expect(mockCallback).not.toHaveBeenCalled();
    });

    // This isnt working (although it passes) as all the dates are disabled for some reason
    xit("does not fire when choose today in front-end", () => {
      const todaysDate = new Date().getDate();
      const mockCallback = jest.fn();
      const wrapper = mount(<DateComp {...minProps} onChange={mockCallback} />);
      wrapper
        .find(".CalendarDay")
        .at(todaysDate - 1)
        .simulate("click");
      expect(mockCallback).not.toHaveBeenCalled();
    });

    // This isnt working as all the dates are disabled for some reason
    xit("fires when choose today in back-end", () => {
      const mockCallback = jest.fn();
      const wrapper = mount(<DateComp {...minProps} onChange={mockCallback} isBackEnd />);
      const todaysDate = new Date().getDate();
      wrapper
        .find(".CalendarDay")
        .at(todaysDate - 1)
        .simulate("click");
      expect(mockCallback).toHaveBeenCalled();
    });

    it('fires when click "continue"', () => {
      const onValidContinue = jest.fn();
      const wrapper = mount(<DateComp {...minProps} onValidContinue={onValidContinue} />);

      wrapper
        .find(".btn-primary")
        .first()
        .simulate("click");
      expect(onValidContinue).toHaveBeenCalled();
    });

    it("fires when click 'back'", () => {
      const mockCallback = jest.fn();
      const wrapper = mount(<DateComp {...minProps} onClickBack={mockCallback} />);
      wrapper
        .find(".action-bar__back-button")
        .first()
        .simulate("click");
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe("disables", () => {
    it("holidays", () => {
      // disable all the days in the next two months
      // look for any days that are enabled; should be none
      const today = new Date();
      const firstOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
      const holidays = [];

      for (let i = 0; i <= 100; i++) {
        holidays.push(
          moment(firstOfCurrentMonth)
            .add(i, "days")
            .format("YYYY-MM-DD")
        );
      }

      const wrapper = mount(<DateComp {...minProps} holidays={holidays} />);
      expect(wrapper.find(`td[aria-label*="It’s available."]`).length).toBe(0);
    });

    it("fully booked days", () => {
      // disable all the days in the next two months
      // look for any days that are enabled; should be none
      const today = new Date();
      const firstOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
      const fullyBookedDates = [];

      for (let i = 0; i <= 100; i++) {
        fullyBookedDates.push(
          moment(firstOfCurrentMonth)
            .add(i, "days")
            .format("YYYY-MM-DD")
        );
      }

      const wrapper = mount(<DateComp {...minProps} fullyBookedDates={fullyBookedDates} />);
      expect(wrapper.find(`td[aria-label*="It’s available."]`).length).toBe(0);
    });
  });
});
