import React from "react";
import { storiesOf } from "@storybook/react";
import { ZonesPage } from "./Zones.jsx";
// import ZonesStripped from "./ZonesStripped.jsx";

const fakeData = [
  { id: 23, name: "Downtown", postalCodes: ["9021*", "90225", "90226", "90229", "903**", "90438"] },
  { id: 88, name: "West End", postalCodes: ["9010*"] },
  { id: 94, name: "Suburbs", postalCodes: ["90288", "90289", "90293"] }
];

async function onSaveZone() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      if (Math.random() * 2 > 1) {
        resolve();
      } else {
        reject("Example random server validation error");
      }
    }, 1000);
  });
}

async function onDeleteZone() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve();
    }, 1000);
  });
}

const props = {
  zones: fakeData,
  onDeleteZone,
  onSaveZone,
  isCanada: true
};

storiesOf("App Pages/Zones", module)
  .add("Basic", () => <ZonesPage {...props} />)
  .add("No Zones", () => <ZonesPage {...props} zones={[]} />)
  .add("Loading", () => <ZonesPage {...props} zones={null} />);

// storiesOf("App Pages/Zones", module).add("index", () => <ZonesStripped onSave={() => {}} />);
