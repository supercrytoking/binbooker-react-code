import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import { mount } from "enzyme";
import { Dates } from "./Dates.jsx";
import * as api from "Utils/services.jsx";

jest.mock("Utils/services.jsx", () => {
  return {
    get: jest.fn(),
    put: jest.fn()
  };
});

const OrdersContext = React.createContext();

function OrdersProvider({ children }) {
  const [orders, setOrders] = React.useState(null);
  const [activeOrder, setActiveOrder] = React.useState(null);
  const thingsToShare = { orders, setOrders, activeOrder, setActiveOrder };

  return <OrdersContext.Provider value={thingsToShare}>{children}</OrdersContext.Provider>;
}

describe("<Dates />", () => {
  const minProps = {
    dropOff: "2018-05-20",
    id: 1,
    pickUp: "2018-05-25",
    context: OrdersContext,
    user: {
      maxJobsSunday: 9,
      maxJobsMonday: 9,
      maxJobsTuesday: 9,
      maxJobsWednesday: 9,
      maxJobsThursday: 9,
      maxJobsFriday: 9,
      maxJobsSaturday: 9
    }
  };

  function renderWithContext(props) {
    return mount(
      <OrdersProvider>
        <Dates {...props} context={OrdersContext} />
      </OrdersProvider>
    );
  }

  it("renders", () => {
    api.get.mockResolvedValueOnce([]);
    const wrapper = renderWithContext(minProps);

    return Promise.resolve(wrapper)
      .then(() => {})
      .then(() => {})
      .then(() => {
        wrapper.update();
        expect(wrapper.find(".sidepanel__dates-tab").length).toEqual(1);
      });
  });
});
