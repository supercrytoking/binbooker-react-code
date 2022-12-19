import React from "react";

export const OrdersContext = React.createContext();

export default function OrdersProvider({ children }) {
  const [orders, setOrders] = React.useState(null);
  const thingsToShare = { orders, setOrders };

  return <OrdersContext.Provider value={thingsToShare}>{children}</OrdersContext.Provider>;
}
