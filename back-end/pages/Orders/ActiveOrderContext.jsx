import React from "react";

export const ActiveOrderContext = React.createContext();

export default function ActiveOrderProvider({ children }) {
  const [activeOrder, setActiveOrder] = React.useState(null);
  const thingsToShare = { activeOrder, setActiveOrder };

  return <ActiveOrderContext.Provider value={thingsToShare}>{children}</ActiveOrderContext.Provider>;
}
