import React from "react";
import { storiesOf } from "@storybook/react";
import DeleteModal from ".";

storiesOf("Components/DeleteModal", module)
  .add("index", () => <DeleteModal isVisible subjectName="Bin" onDelete={() => {}} onClose={() => {}} />)
  .add("pending", () => <DeleteModal isVisible isPending subjectName="Bin" onDelete={() => {}} onClose={() => {}} />);
