import React from "react";
import { withRouter } from "react-router-dom";
import Nav from "./Nav.jsx";

const NavWithHistory = withRouter(({ currentStep, history }) => (
  <Nav
    currentStep={currentStep}
    onClickStep={newStep => {
      history.push(newStep);
    }}
  />
));

export default NavWithHistory;
