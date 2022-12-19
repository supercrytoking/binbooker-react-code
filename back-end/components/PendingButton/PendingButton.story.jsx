import React from "react";
import { storiesOf } from "@storybook/react";
import PendingButton from "./PendingButton.jsx";

storiesOf("Components/PendingButton", module).add("index", () => (
  <div>
    <PendingButton pending onClick={() => {}} />
    <PendingButton pending onClick={() => {}} />
  </div>
));
