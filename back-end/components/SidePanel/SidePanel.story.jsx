import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, select, text } from "@storybook/addon-knobs";
import SidePanel from "./SidePanel";

const props = {
  heading: "My Heading",
  children: <p>hello from inside the panel</p>,
  onOpen: () => {},
  onClose: () => {},
  open: true
};

storiesOf("Components/SidePanel", module)
  .addDecorator(withKnobs)
  .add("Small", () => <SidePanel {...props} width="small" />)
  .add("Medium", () => <SidePanel {...props} width="medium" />)
  .add("Large", () => <SidePanel {...props} width="large" />);
