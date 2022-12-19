// This is the entrypoint of the back-end

import React from "react";
import CreateOrder from "./CreateOrder.jsx";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import { UserContext } from "../../UserProvider.jsx";
import Spinner from "Components/Spinner";
import "./index.scss";

export default function CreateOrderPage() {
  const loggedInStaff = React.useContext(LoggedInStaffContext);
  const user = React.useContext(UserContext);

  if (!loggedInStaff || !user) {
    return <Spinner />;
  }

  if (!loggedInStaff.pageAccess.createOrder) {
    return null;
  }

  return (
    <div className="be__create-order-wrapper">
      <CreateOrder isLoggedIn user={user} />
    </div>
  );
}
