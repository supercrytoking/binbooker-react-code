import React from "react";
import { node } from "prop-types";
import { get } from "Utils/services.jsx";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";

//This renders once on app load. It wraps the entire app.  If need to see an example, SchedulePage/Schedule/index.jsx uses it.

export const LoggedInStaffContext = React.createContext();

export default class LoggedInStaffProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedInStaff: null
    };
  }

  async componentDidMount() {
    await this.getLoggedInStaffData();
  }

  getLoggedInStaffData = async () => {
    const json = await get("/api/v2/staff?loggedIn");
    const loggedInStaff = {
      id: +json.id,
      name: json.name,
      email: json.email,
      pageAccess: json.pageAccess
    };

    this.setState({ loggedInStaff });
  };

  render() {
    if (this.state.loggedInStaff === null) {
      //still loading user (so dont know permissions yet)
      return <SpinnerCentred />;
    }

    return (
      <LoggedInStaffContext.Provider value={this.state.loggedInStaff}>
        {this.props.children}
      </LoggedInStaffContext.Provider>
    );
  }
}

LoggedInStaffProvider.propTypes = {
  children: node.isRequired
};
