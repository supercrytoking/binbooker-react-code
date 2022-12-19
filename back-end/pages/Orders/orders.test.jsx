import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
// import React from "react";
// import expect from "expect";
// import { shallow, mount } from "enzyme";
// TODO: Error "Cannot find module '../../LoggedInStaffProvider.jsx"
//import OrdersPage from ".";

// The component needs to be refactored so the orders (and everything else) are passed into it from 'index.jsx'.
// Then the individual components can be tested.

describe("<OrdersPage />", () => {
  xit("lists orders", () => {});

  xit("filters orders when you type in something", () => {});

  xit("fires a callback when you click a row", () => {});

  xit('opens the "items" tab by default when you click a row', () => {});

  xit('opens the "dates" tab when clicked', () => {});

  xit('opens the "address" tab when clicked', () => {});

  xit('closes the sidepanel when you click the "x"', () => {});
});
