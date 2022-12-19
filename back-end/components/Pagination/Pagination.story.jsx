import React from "react";
import { storiesOf } from "@storybook/react";
import Pagination from ".";

const noop = () => {};

storiesOf("Components/Pagination", module)
  .add("No pages", () => <Pagination currentPage={1} totalPages={0} />)
  .add("On only page", () => <Pagination currentPage={1} totalPages={1} />)
  .add("On first page", () => (
    <Pagination currentPage={1} totalPages={5} onClickNext={noop} onClickPrev={noop} onChange={noop} />
  ))
  .add("On middle page", () => (
    <Pagination currentPage={3} totalPages={5} onClickNext={noop} onClickPrev={noop} onChange={noop} />
  ))
  .add("On last page", () => (
    <Pagination currentPage={5} totalPages={5} onClickNext={noop} onClickPrev={noop} onChange={noop} />
  ))
  .add("Tons of pages", () => (
    <div style={{ marginTop: "400px" }}>
      <Pagination currentPage={1} totalPages={999} onClickNext={noop} onClickPrev={noop} onChange={noop} />
    </div>
  ));
