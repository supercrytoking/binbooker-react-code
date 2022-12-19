import React from "react";
import { storiesOf } from "@storybook/react";
import BinBookerTermsOfUseAgreement from "./BinBookerTermsOfUseAgreement.jsx";
import UserProvider from "../../UserProvider.jsx";

storiesOf("App Pages/Terms Of Use", module).add("index", () => (
  <UserProvider>
    <BinBookerTermsOfUseAgreement>
      If you are seeing this, the user has agreed to the terms
    </BinBookerTermsOfUseAgreement>
  </UserProvider>
));
