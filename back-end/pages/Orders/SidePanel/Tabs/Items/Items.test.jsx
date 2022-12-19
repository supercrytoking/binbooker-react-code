import "jsdom-global/register"; // needed for clicking in nested components (i.e. not "shallow" tests)
import React from "react";
import expect from "expect";
import { mount } from "enzyme";
import { Items } from "./Items.jsx";
import * as api from "Utils/services.jsx";

jest.mock("Utils/services.jsx", () => {
  return {
    get: jest.fn()
  };
});

const OrdersContext = React.createContext();

function OrdersProvider({ children }) {
  const [orders, setOrders] = React.useState(null);
  const [activeOrder, setActiveOrder] = React.useState(null);
  const thingsToShare = { orders, setOrders, activeOrder, setActiveOrder };

  return <OrdersContext.Provider value={thingsToShare}>{children}</OrdersContext.Provider>;
}

function renderWithContext(props) {
  return mount(
    <OrdersProvider>
      <Items {...props} context={OrdersContext} />
    </OrdersProvider>
  );
}

xdescribe("<Items />", () => {
  const minProps = {
    orderId: 1,
    orderItems: [
      {
        id: 1,
        orderId: 1,
        description: "Rental",
        quantity: 1.0,
        unitPrice: 300.0,
        tax1: 0.05,
        tax2: 0.08,
        paymentMethod: "credit-card",
        paymentConfirmationId: "aaa"
      },
      {
        id: 2,
        orderId: 1,
        description: "Weight",
        quantity: 2.5,
        unitPrice: 100.0,
        tax1: 0.05,
        tax2: 0.08,
        paymentMethod: "credit-card",
        paymentConfirmationId: "aab"
      }
    ],
    afterDeleteItem: () => {},
    afterDeleteOrder: () => {},
    items: [],
    afterAddItem: () => {},
    tax1: 5,
    tax1Name: "gst",
    tax2: 8,
    tax2Name: "pst",
    stripeId: "",
    onSuccessfullyPaidOutstanding: () => {},
    user: { stripePublishableKey: "" }
  };

  it("lists items with proper amounts", () => {
    api.get.mockResolvedValueOnce([]);
    const wrapper = renderWithContext(minProps);

    return Promise.resolve(wrapper)
      .then(() => {})
      .then(() => {})
      .then(() => {
        wrapper.update();
        expect(wrapper.find("tr.order-item").length).toEqual(2); // has a list of order items
        expect(wrapper.find("[data-qa-id='subtotal']").text()).toEqual("$550.00"); // calculates the proper subtotal
        expect(wrapper.find("[data-qa-id='tax1']").text()).toEqual("$27.50"); // calculates the proper simple tax1
        expect(wrapper.find("[data-qa-id='tax2']").text()).toEqual("$44.00"); // calculates the proper simple tax2
        expect(wrapper.find("[data-qa-id='total']").text()).toEqual("$621.50"); // calculates the proper grand total
      });
  });

  // if they order two items simultaneously:
  // 2 * 9.57 * .13 = 2.4882
  // it whould charge them $2.49 in tax.
  it("calculates the proper tax on two items on a single charge", () => {
    api.get.mockResolvedValueOnce([]);
    const props = {
      ...minProps,
      orderItems: [
        {
          id: 1,
          orderId: 1,
          description: "Whatever",
          quantity: 1.0,
          unitPrice: 9.57,
          tax1: 0.13,
          tax2: 0,
          paymentMethod: "credit-card",
          paymentConfirmationId: "aaa"
        },
        {
          id: 2,
          orderId: 1,
          description: "Whatever",
          quantity: 1.0,
          unitPrice: 9.57,
          tax1: 0.13,
          tax2: 0,
          paymentMethod: "credit-card",
          paymentConfirmationId: "aaa"
        }
      ]
    };
    const wrapper = renderWithContext(props);

    return Promise.resolve(wrapper)
      .then(() => {})
      .then(() => {})
      .then(() => {
        wrapper.update();
        expect(wrapper.find("[data-qa-id='tax1']").text()).toEqual("$2.49");
      });
  });

  // if they order those same two items separately:
  // 1 * 9.57 * .13 = 1.2441
  // 1 * 9.57 * .13 = 1.2441
  // it would charge them $1.24 each time, or $2.48 in tax total.
  it("calculates the proper tax1 on two items on two separate charges", () => {
    api.get.mockResolvedValueOnce([]);
    const props = {
      ...minProps,
      orderItems: [
        {
          id: 1,
          orderId: 1,
          description: "Whatever",
          quantity: 1.0,
          unitPrice: 9.57,
          tax1: 0.13,
          tax2: 0,
          paymentMethod: "credit-card",
          paymentConfirmationId: "aaa"
        },
        {
          id: 2,
          orderId: 1,
          description: "Whatever",
          quantity: 1.0,
          unitPrice: 9.57,
          tax1: 0.13,
          tax2: 0,
          paymentMethod: "credit-card",
          paymentConfirmationId: "bbbb"
        }
      ]
    };
    const wrapper = renderWithContext(props);

    return Promise.resolve(wrapper)
      .then(() => {})
      .then(() => {})
      .then(() => {
        wrapper.update();
        expect(wrapper.find("[data-qa-id='tax1']").text()).toEqual("$2.48");
      });
  });

  it("doesnt show tax1 when there is none", () => {
    api.get.mockResolvedValueOnce([]);
    const props = {
      ...minProps,
      tax1: 0,
      tax1Name: ""
    };
    const wrapper = renderWithContext(props);

    return Promise.resolve(wrapper)
      .then(() => {})
      .then(() => {})
      .then(() => {
        wrapper.update();
        expect(wrapper.contains("[data-qa-id='tax1']")).toBeFalsy();
      });
  });

  it("doesnt show tax2 when there is none", () => {
    api.get.mockResolvedValueOnce([]);
    const props = {
      ...minProps,
      tax2: 0,
      tax2Name: ""
    };
    const wrapper = renderWithContext(props);

    return Promise.resolve(wrapper)
      .then(() => {})
      .then(() => {})
      .then(() => {
        wrapper.update();
        expect(wrapper.contains("[data-qa-id='tax2']")).toBeFalsy();
      });
  });

  xit("adding an item recalculates the subtotal, taxes and total", () => {});
  xit('clicking "add item" opens a modal', () => {});
  xit('clicking "..." opens a menu', () => {});
  xit('clicking "email receipt" opens a modal', () => {});
  xit('clicking "delete order" opens a modal', () => {});
});
