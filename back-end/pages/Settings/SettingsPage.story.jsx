import React from "react";
import { storiesOf } from "@storybook/react";
import SettingsPage from ".";
import LoggedInStaffProvider from "../../LoggedInStaffProvider.jsx";

storiesOf("App Pages/Settings", module).add("Example", () => (
  <LoggedInStaffProvider>
    <SettingsPage />
  </LoggedInStaffProvider>
));
