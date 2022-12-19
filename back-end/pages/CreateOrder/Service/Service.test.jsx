import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import { shallow, mount } from "enzyme";
import Service from "./Service.jsx";

describe("<Service />", () => {
  const services = [
    {
      id: 5,
      title: "20 Yard",
      description: "20 Really long description goes here.",
      imagePath: "sample-20.jpg",
      calculatedPrice: "400.00",
      suggestedStartDate: null,
      suggestedEndDate: null,
      noDatesAvailable: false
    },
    {
      id: 6,
      title: "10 Yard",
      description: "10 Really long description goes here.",
      imagePath: "sample-10.jpg",
      calculatedPrice: "300.00",
      suggestedStartDate: null,
      suggestedEndDate: null,
      noDatesAvailable: false
    }
  ];

  const minProps = {
    activeServiceId: null,
    customUserText: "",
    error: "",
    hasTax: true,
    isLoading: false,
    onChange: () => {},
    onClickBack: () => {},
    onValidContinue: () => {},
    services
  };

  beforeEach(() => {
    // Need to mock this. Doing it in jest.setup.js should work, but is not
    window.scrollTo = jest.fn();
  });

  it("shows custom text if present", () => {
    let wrapper = mount(<Service {...minProps} customUserText="CustomUserText" />);
    expect(wrapper.find(".custom-user-text").length).toEqual(1);
  });

  it("does not show custom text if not present", () => {
    let wrapper = mount(<Service {...minProps} />);
    expect(wrapper.find(".custom-user-text").length).toEqual(0);
  });

  it("lists services when there are some", () => {
    const wrapper = shallow(<Service {...minProps} />);
    expect(wrapper.find(".service").length).toEqual(2);
  });

  it("shows a message when there are no services", () => {
    const wrapper = shallow(<Service {...minProps} services={[]} />);
    expect(wrapper.find(".service").length).toEqual(0);
    expect(wrapper.find(".no-services-message").length).toEqual(1);
  });

  it("no service is selected when no service is passed in", () => {
    const wrapper = shallow(<Service {...minProps} />);
    expect(wrapper.find(".service--active").length).toEqual(0);
  });

  it("a service is selected when a service is passed in", () => {
    const wrapper = shallow(<Service {...minProps} activeServiceId={5} />);
    expect(wrapper.find(".service--active").length).toEqual(1);
  });

  it("shows the suggested dates messaging when applicable", () => {
    const newServices = JSON.parse(JSON.stringify(services));
    newServices[0].suggestedStartDate = "2021-05-18";
    newServices[0].suggestedEndDate = "2021-05-22";

    const props = {
      ...minProps,
      services: newServices
    };

    const wrapper = shallow(<Service {...props} />);
    expect(wrapper.find(".service").find("a").length).toEqual(1);
  });

  it("does not show the suggested dates messaging when not applicable", () => {
    const wrapper = shallow(<Service {...minProps} />);
    expect(wrapper.find(".alert").length).toEqual(0);
  });

  // excluding this test, the rest all pass
  // running only it, it passes
  // running all tests, two after it fail
  it("shows 'no availability' messaging when applicable", () => {
    const newServices = JSON.parse(JSON.stringify(services));
    newServices[0].noDatesAvailable = true;

    const props = {
      ...minProps,
      services: newServices
    };

    const wrapper = mount(<Service {...props} />);
    expect(wrapper.find(".alert").length).toEqual(1);
  });

  it("does not show 'no availability' messaging when not applicable", () => {
    const wrapper = shallow(<Service {...minProps} />);
    expect(wrapper.find(".alert").length).toEqual(0);
  });

  it("fires a callback when click suggested date link", () => {
    const mockHandleSelectSuggestedDates = jest.fn();
    const newServices = JSON.parse(JSON.stringify(services));
    newServices[0].suggestedStartDate = "2021-05-18";
    newServices[0].suggestedEndDate = "2021-05-22";

    const props = {
      ...minProps,
      services: newServices
    };

    const wrapper = mount(<Service {...props} handleSelectSuggestedDates={mockHandleSelectSuggestedDates} />);

    wrapper
      .find(".service")
      .find("a")
      .simulate("click");
    expect(mockHandleSelectSuggestedDates).toHaveBeenCalled();
  });

  it("does not fire onChange callback when click suggested date link", () => {
    const mockHandleSelectSuggestedDates = jest.fn();
    const mockOnChange = jest.fn();
    const newServices = JSON.parse(JSON.stringify(services));
    newServices[0].suggestedStartDate = "2021-05-18";
    newServices[0].suggestedEndDate = "2021-05-22";

    const props = {
      ...minProps,
      services: newServices
    };

    const wrapper = mount(
      <Service {...props} onChange={mockOnChange} handleSelectSuggestedDates={mockHandleSelectSuggestedDates} />
    );
    wrapper
      .find(".service")
      .find("a")
      .simulate("click");
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("fires a callback when click continue", () => {
    const mockOnValidContinue = jest.fn();
    const wrapper = mount(<Service {...minProps} activeServiceId={5} onValidContinue={mockOnValidContinue} />);
    wrapper
      .find(".btn-primary")
      .first()
      .simulate("click");
    expect(mockOnValidContinue).toHaveBeenCalled();
  });

  it("fires a callback when click 'back'", () => {
    const mockOnClickBack = jest.fn();
    const wrapper = mount(<Service {...minProps} onClickBack={mockOnClickBack} />);
    wrapper
      .find("a.btn")
      .first()
      .simulate("click");
    expect(mockOnClickBack).toHaveBeenCalled();
  });
});
