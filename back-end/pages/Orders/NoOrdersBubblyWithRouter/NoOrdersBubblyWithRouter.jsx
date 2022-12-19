import React from "react";
import { withRouter } from "react-router-dom";
import Bubbly from "Components/Bubbly";

const NoOrdersBubblyWithRouter = withRouter(({ history }) => (
  <Bubbly
    title="No Orders"
    description="No orders have been created yet."
    actionTitle="Create new Order"
    onClick={() => {
      history.push("/back/create-order/code");
    }}
  />
));

export default NoOrdersBubblyWithRouter;
