import React from "react";
import { storiesOf } from "@storybook/react";
import { Services } from "./Services.jsx";
import Details from "./Details";
import Pricing from "./Pricing";
import ServicesContext from "./ServicesContext.jsx";
import json from "../../../.json-server/db.json";

storiesOf("App Pages/Services", module)
  .add("Basic", () => <Services services={json.services} onSave={() => {}} />)
  .add("No Services", () => <Services services={[]} onSave={() => {}} />)
  .add("Loading", () => <Services services={null} onSave={() => {}} />)
  .add("Details Tab", () => {
    const activeService = {};
    const setActiveService = () => {};
    const updateActiveServiceDetails = () => {};

    return (
      <ServicesContext.Provider value={{ activeService, setActiveService, updateActiveServiceDetails }}>
        <Details isSaving={false} />
      </ServicesContext.Provider>
    );
  })
  .add("Pricing Tab", () => {
    const activeService = json.services[0];
    const setActiveService = () => {};
    const updateActiveServiceDetails = () => {};

    return (
      <ServicesContext.Provider value={{ activeService, setActiveService, updateActiveServiceDetails }}>
        <Pricing isSaving={false} />
      </ServicesContext.Provider>
    );
  });
