import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import ToggleSwitch from "./ToggleSwitch.jsx";

function WithState() {
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <ToggleSwitch
      id="mandatory"
      isChecked={isChecked}
      isSmall={boolean("isSmall", false)}
      isDisabled={boolean("isDisabled", false)}
      onChange={() => {
        setIsChecked(!isChecked);
      }}
    />
  );
}

storiesOf("Components/ToggleSwitch", module)
  .addDecorator(withKnobs)
  .add("All", () => <WithState />);
