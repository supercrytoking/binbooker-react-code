import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import Service from "./Service.jsx";

const props = {
  activeBin: { id: 2, foreignId: "40-02" },
  activeServiceId: 4,
  error: null,
  hasTax: true,
  isLoading: false,
  onChange: service => {
    alert("you chose service " + service.title);
  },
  onChangeActiveBinId: binId => {
    alert("you chose bin " + binId);
  },
  onClickBack: () => {},
  onValidContinue: () => {},
  services: [
    {
      id: 1,
      imagePath: "http://sample.binbooker.test/images/services/60247c2825d5a2a7da3404e13e13e39f30324775.png",
      title: "5 yard",
      size: "5",
      rentalPrice: 99,
      extraDaysPrice: 12,
      description: "This one should not be clickable but will suggest alternate dates",
      suggestedStartDate: "2021-05-18",
      suggestedEndDate: "2021-05-22",
      availableBins: null,
      noDatesAvailable: false
    },
    {
      id: 2,
      imagePath: "",
      title: "15 yard",
      size: "15",
      rentalPrice: 149,
      extraDaysPrice: 12,
      description: "This one should not be clickable and not suggest alternate dates",
      suggestedStartDate: null,
      suggestedEndDate: null,
      availableBins: [{ 3: "15-01" }],
      noDatesAvailable: true
    },
    {
      id: 3,
      imagePath: "",
      title: "20 yard",
      size: "20",
      rentalPrice: 299,
      extraDaysPrice: 12,
      description: "This one should be clickable.",
      suggestedStartDate: null,
      suggestedEndDate: null,
      availableBins: null,
      noDatesAvailable: false
    },
    {
      id: 4,
      imagePath: "",
      title: "40 yard",
      size: "40",
      rentalPrice: 399,
      extraDaysPrice: 12,
      description: "This one should be clickable.",
      suggestedStartDate: null,
      suggestedEndDate: null,
      availableBins: [{ 1: "40-01" }, { 2: "40-02" }],
      noDatesAvailable: false
    }
  ]
};

storiesOf("App Pages/Create Order/Steps", module)
  .addDecorator(withKnobs)
  .add("Service", () => (
    <div className="create-order">
      <Service
        {...props}
        customUserText={text("customUserText", "Put custom message here")}
        error={text("error", null)}
        hasTax={boolean("hasTax", true)}
        isLoading={boolean("isLoading", false)}
      />
    </div>
  ))
  .add("Service - no services", () => (
    <div className="create-order">
      <Service {...props} services={[]} />
    </div>
  ));
