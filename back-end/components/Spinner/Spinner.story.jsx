import React from "react";
import { storiesOf } from "@storybook/react";
import Spinner from "./Spinner.jsx";
import SpinnerCentred from "./SpinnerCentred.jsx";

storiesOf("Components/Spinner", module)
  .add("Sizes", () => (
    <React.Fragment>
      Tiny: <Spinner size="tiny" />
      <br />
      Small: <Spinner size="small" />
      <br />
      Medium (default): <Spinner size="medium" />
      <br />
      Large: <Spinner size="large" />
    </React.Fragment>
  ))
  .add("Colours", () => (
    <React.Fragment>
      Black (default): <Spinner colour="black" />
      White:{" "}
      <div style={{ backgroundColor: "red" }}>
        <Spinner colour="white" />
      </div>
    </React.Fragment>
  ))
  .add("Centred", () => <SpinnerCentred />);
