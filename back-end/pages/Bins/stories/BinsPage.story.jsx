import React from "react";
import { storiesOf } from "@storybook/react";
import Bins from "../Bins.jsx";
import SampleData from "./bins.json";

storiesOf("App Pages/Bins", module)
  .add("Basic", () => (
    <Bins bins={SampleData} error="" isPending={false} onClickSave={() => {}} onClickDelete={() => {}} />
  ))
  .add("No Bins", () => <Bins bins={[]} error="" isPending={false} onClickSave={() => {}} onClickDelete={() => {}} />)
  .add("Loading", () => (
    <Bins bins={null} error="" isPending={false} onClickSave={() => {}} onClickDelete={() => {}} />
  ));
