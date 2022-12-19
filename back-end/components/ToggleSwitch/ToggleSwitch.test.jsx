import React from "react";
import { shallow } from "enzyme";
import ToggleSwitch from "./ToggleSwitch";

const chkID = "checkboxID";

describe("Toggle Switch Component", () => {
  it("should render without crashing", () => {
    const ToggleSwitchComponent = shallow(<ToggleSwitch />);
    expect(ToggleSwitchComponent.html()).not.toHaveLength(0);
  });

  it("should render if id is supplied", () => {
    const ToggleSwitchComponent = shallow(<ToggleSwitch id={chkID} />);
    expect(ToggleSwitchComponent.find("label")).not.toHaveLength(0);
  });

  it("should disable switch slider if it contains disabled props", () => {
    const ToggleSwitchComponent = shallow(<ToggleSwitch id={chkID} isDisabled={true} />);
    expect(ToggleSwitchComponent.find("#" + chkID).props().disabled).toBe(true);
  });
});
