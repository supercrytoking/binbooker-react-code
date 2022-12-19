import React from "react";
import { node } from "prop-types";
import { getParameterByName } from "Utils/library.jsx";

//This renders every time they change the page.
//It does not render when open a sidepanel.
//It does not render when change step in ordering process. This will fix when I put each step of ordering process on its own URL?

//When change page, reset timer to 24 minutes/1440 seconds (the PHP session length).
//When the timer runs out, record which page they are on and redirect them to login page.
//When login, check if have recorded which page they are on.

let sessionTimeout;
const sessionDurationInSeconds = 1440;
const redirectParameterName = "returnUrl";

export default class LoggedInProvider extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  setRedirectTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
      window.location = `${window.location.origin}/back/login.php?${redirectParameterName}=${window.location.pathname}`;
    }, sessionDurationInSeconds * 1000);
  }

  render() {
    if (getParameterByName(redirectParameterName)) {
      window.location = `${window.location.origin}${getParameterByName(redirectParameterName)}`;
    }

    this.setRedirectTimeout();
    return this.props.children;
  }
}

LoggedInProvider.propTypes = {
  children: node.isRequired
};
