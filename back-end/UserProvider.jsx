import React from "react";
import { node } from "prop-types";
import PageNotFound from "Components/PageNotFound";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import { getUser } from "./api";

//This renders once on app load. It wraps the entire app -- both back and front end (so careful what put in it).
//If need to see an example, SchedulePage/Schedule/index.jsx uses it.

export const UserContext = React.createContext();

export default function UserProvider(props) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    const user = await getUser();

    // Note: there is more data in user object, i'm just changing converting from strings to numbers
    user.maxJobsMonday = +user.maxJobsMonday;
    user.maxJobsTuesday = +user.maxJobsTuesday;
    user.maxJobsWednesday = +user.maxJobsWednesday;
    user.maxJobsThursday = +user.maxJobsThursday;
    user.maxJobsFriday = +user.maxJobsFriday;
    user.maxJobsSaturday = +user.maxJobsSaturday;
    user.maxJobsSunday = +user.maxJobsSunday;
    user.tax1 = +user.tax1;
    user.tax2 = +user.tax2;
    user.extraCostPerDay = +user.extraCostPerDay;
    user.includedDays = +user.includedDays;
    user.showHeader = !!+user.showHeader;

    // A hash gets added to the URL when they visit:
    //   sample.binbooker.ca
    //   sample.binbooker.ca/back
    // which is used below to swap the currency (so Canadian text appears on the sample site)

    if (window.location.host.split(".")[0] === "sample") {
      if (
        window.location.hash === "#ca" ||
        (localStorage.getItem("demoUseCanada") && localStorage.getItem("demoUseCanada") === true)
      ) {
        user.currency = "CAD";
        localStorage.setItem("demoUseCanada", true);
      }
    }

    setUser(user);
  }

  if (!user) {
    return <SpinnerCentred />;
  }

  if (!user.url) {
    return <PageNotFound />;
  }

  return <UserContext.Provider value={user}>{props.children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: node.isRequired
};
