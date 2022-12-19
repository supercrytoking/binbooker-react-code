import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text } from "@storybook/addon-knobs";
import CompanyHeader from "./CompanyHeader.jsx";

storiesOf("App Pages/Create Order", module)
  .addDecorator(withKnobs)
  .add("CompanyHeader", () => (
    <CompanyHeader
      email={text("email", "contact@somecompany.com")}
      logoPath="https://sample.binbooker.com/images/logos/sample.png"
      phoneNumber={text("phoneNumber", "1-800-123-4567")}
      url={text("url", "http://binbooker.com#demo")}
    />
  ));
