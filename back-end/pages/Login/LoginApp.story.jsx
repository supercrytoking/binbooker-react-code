import React from "react";
import { storiesOf } from "@storybook/react";
import LoginApp from ".";
import PageNotFound from "Components/PageNotFound";

const props = {
  isDemoAccount: false,
  onSubmit: () => {
    alert("Clicked submit.");
  }
};

storiesOf("Login", module)
  .add("demo account", () => <LoginApp {...props} isDemoAccount />)
  .add("non-demo account", () => <LoginApp {...props} />)
  .add("invalid url", () => <PageNotFound />);
