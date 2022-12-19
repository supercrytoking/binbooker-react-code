import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import { shallow } from "enzyme";
import { SchedulePage } from "./Schedule.jsx";
import TruckPicker from "Components/TruckPicker";

describe("<SchedulePage />", () => {
  const trucksArray1 = [
    {
      id: "1",
      foreignId: "Fuso",
      appointments: [],
      fillers: []
    }
  ];

  const trucksArray2 = [
    {
      id: "1",
      foreignId: "Honda",
      appointments: [],
      fillers: []
    },
    {
      id: "2",
      foreignId: "Fuso",
      appointments: [],
      fillers: []
    }
  ];

  it("don't show trucks selector if they just have one truck", () => {
    const originalUseContext = React.useContext;
    const mockReactUseContext = jest.fn().mockReturnValue({
      allTrucks: trucksArray1,
      trucks: trucksArray1,
      activeTruckId: 1,
      handleChangeTruck: () => {}
    });
    React.useContext = mockReactUseContext;

    let wrapper = shallow(<SchedulePage />);
    expect(wrapper.find(TruckPicker).length).toEqual(0);

    React.useContext = originalUseContext;
  });

  it("show trucks selector if they have more than one truck", () => {
    const originalUseContext = React.useContext;
    const mockReactUseContext = jest.fn().mockReturnValue({
      allTrucks: trucksArray2,
      trucks: trucksArray2,
      activeTruckId: 1,
      handleChangeTruck: () => {}
    });
    React.useContext = mockReactUseContext;

    let wrapper = shallow(<SchedulePage />);
    expect(wrapper.find(TruckPicker).length).toEqual(1);

    React.useContext = originalUseContext;
  });
});
