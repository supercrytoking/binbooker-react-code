import React from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Button, Popover } from "react-bootstrap";
import { UserContext } from "../../../../../UserProvider.jsx";
import { formatDollarAmount } from "Utils/library.jsx";
import { PAYMENT_METHODS } from "Utils/constants.jsx";
import { get, post } from "Utils/services.jsx";
import AddItemsModal from "./AddItemsModal";
import EmailReceiptModal from "./EmailReceiptModal/emailReceiptModal.jsx";
import DeleteOrderModal from "./DeleteOrderModal/deleteOrderModal.jsx";
import PayOutstandingAmountModal from "./PayOutstandingAmountModal/payOutstandingAmountModal.jsx";
import Spinner from "Components/Spinner";
import { ActiveOrderContext } from "../../../ActiveOrderContext";
import { OrdersContext } from "../../../OrdersContext";
import "./Items.scss";

export function Items(props) {
  const { activeOrder, setActiveOrder } = React.useContext(ActiveOrderContext);
  const { orders, setOrders } = React.useContext(OrdersContext);
  const [items, setItems] = React.useState(null); //the available items (all items)

  const [showAddItemsModal, setShowAddItemsModal] = React.useState(false);
  const [showEmailReceiptModal, setShowEmailReceiptModal] = React.useState(false);
  const [showDeleteOrderModal, setShowDeleteOrderModal] = React.useState(false);
  const [showPayOutstandingAmountModal, setShowPayOutstandingAmountModal] = React.useState(false);

  const [tax1, setTax1] = React.useState(0);
  const [tax2, setTax2] = React.useState(0);
  const [subtotal, setSubtotal] = React.useState(0);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    async function fetchAndSetItemOptions() {
      const _items = await get("/api/v2/items");
      setItems(_items);
    }
    fetchAndSetItemOptions();
  }, []);

  React.useEffect(() => {
    updateTotals(activeOrder.items);
  }, [activeOrder]);

  function getTotals(orderItems, unpaidOnly = false) {
    let tax1 = 0;
    let tax2 = 0;
    let subtotal = 0;
    let total = 0;
    let totals = []; //totals grouped by 'paymentConfirmationId'

    //Go over all of the items. Sum up the taxes and subtotals for each unique 'paymentConfirmationId'
    orderItems.forEach(item => {
      if (!unpaidOnly || item.paymentMethod === PAYMENT_METHODS.invoice) {
        if (!totals[item.paymentConfirmationId]) {
          totals[item.paymentConfirmationId] = {
            tax1: +item.tax1,
            tax2: +item.tax2,
            subtotal: 0
          };
        }

        // Do not calculate the total tax in this loop
        totals[item.paymentConfirmationId].subtotal += +item.quantity * +item.unitPrice;
      }
    });

    //Now that we have the subtotals per payment, calculate the taxes
    //This needs to be separate from above because if a transaction included a refund, there could be a rounding error.
    //E.g. a $500 order with a $499.50 discount and 13% tax should come to $0.57; but doing the tax calculation above comes out to $0.56
    for (var key in totals) {
      tax1 += +(totals[key].subtotal * totals[key].tax1).toFixed(2);
      tax2 += +(totals[key].subtotal * totals[key].tax2).toFixed(2);
      subtotal += totals[key].subtotal;
    }

    total = subtotal + tax1 + tax2;
    return { tax1, tax2, subtotal, total };
  }

  function updateTotals(orderItems) {
    const totals = getTotals(orderItems);

    setTax1(totals.tax1);
    setTax2(totals.tax2);
    setSubtotal(totals.subtotal);
    setTotal(totals.total);
  }

  function toggleAddItemsModal() {
    setShowAddItemsModal(oldValue => !oldValue);
  }

  function translatePaymentMethod(paymentMethod) {
    const newString = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);
    return newString.replace("-", " ");
  }

  function renderTax1() {
    if (props.tax1Name) {
      return (
        <tr className="total-row">
          <td colSpan={4} className="order-items__title">
            {props.tax1Name}:
          </td>
          <td className="order-items__amount order-item__money" data-qa-id="tax1">
            {formatDollarAmount(tax1)}
          </td>
        </tr>
      );
    }
    return null;
  }

  function renderTax2() {
    if (props.tax2Name) {
      return (
        <tr className="total-row">
          <td colSpan={4} className="order-items__title">
            {props.tax2Name}:
          </td>
          <td className="order-items__amount order-item__money" data-qa-id="tax2">
            {formatDollarAmount(tax2)}
          </td>
        </tr>
      );
    }
    return null;
  }

  function renderSubtotal() {
    return (
      <tr className="total-row">
        <td colSpan={4} className="order-items__title">
          Subotal:
        </td>
        <td className="order-items__amount order-item__money" data-qa-id="subtotal">
          {formatDollarAmount(subtotal)}
        </td>
      </tr>
    );
  }

  function renderTotal() {
    return (
      <tr className="total-row grand-total-row">
        <td colSpan={4} className="order-items__title">
          Total:
        </td>
        <td className="order-items__amount order-item__money" data-qa-id="total">
          {formatDollarAmount(total)}
        </td>
      </tr>
    );
  }

  function renderItems() {
    return activeOrder.items.map(item => {
      return (
        <tr className="order-item" key={item.id}>
          <td>{item.description}</td>
          <td>{translatePaymentMethod(item.paymentMethod)}</td>
          <td>{+item.quantity}</td>
          <td className="order-item__money">{formatDollarAmount(item.unitPrice)}</td>
          <td className="order-item__money">{formatDollarAmount(item.unitPrice * item.quantity)}</td>
        </tr>
      );
    });
  }

  function renderItemsTable() {
    return (
      <table className="table table-striped orders__items">
        <thead>
          <tr>
            <th className="description-column">Description</th>
            <th className="payment-method-column">Pmt. Method</th>
            <th className="quantity-column">Qty.</th>
            <th className="price-column">Each</th>
            <th className="total-column">Total</th>
          </tr>
        </thead>
        <tbody>
          {renderItems()}
          {renderSubtotal()}
          {renderTax1()}
          {renderTax2()}
          {renderTotal()}
        </tbody>
      </table>
    );
  }

  function viewReceipt() {
    window.open(`/back/view-receipt.php?orderId=${props.orderId}`, "_blank");
  }

  function afterDeleteOrder() {
    setShowDeleteOrderModal(false);

    let newOrders = orders.filter(order => +order.id !== +activeOrder.id);
    setOrders(newOrders);

    setActiveOrder(null);
  }

  function getAmountUnpaid() {
    const totals = getTotals(activeOrder.items, true);
    return totals.total;
  }

  function isFullyPaid() {
    return getAmountUnpaid() === 0;
  }

  function renderPayInvoiceButton() {
    if (isFullyPaid()) {
      return null;
    }

    return (
      <li
        role="presentation"
        onClick={() => {
          setShowPayOutstandingAmountModal(true);
        }}
      >
        Pay Outstanding Amount
      </li>
    );
  }

  // Returns true if even a single item was paid for with credit card
  function getPaidUsingCreditCard() {
    return activeOrder.items.filter(item => item.paymentMethod === PAYMENT_METHODS.creditCard).length > 0;
  }

  function handleSuccessfullyPaidOutstanding(newPaymentMethod) {
    //If the newPaymentMethod was "stripe", that is really a credit card, so use that value
    if (newPaymentMethod === PAYMENT_METHODS.stripe) {
      newPaymentMethod = PAYMENT_METHODS.creditCard;
    }

    // Update the paymentMethod for all unpaid items
    let activeOrderCopy = { ...activeOrder };
    activeOrderCopy.items = activeOrderCopy.items.map(item => {
      if (item.paymentMethod === PAYMENT_METHODS.invoice) {
        item.paymentMethod = newPaymentMethod;
      }
      return item;
    });

    // Update the order to be fully paid
    const ordersCopy = orders.map(order => {
      if (+order.id === +activeOrder.id) {
        order.isFullyPaid = "1";
      }
      return order;
    });

    setActiveOrder(activeOrderCopy);
    setOrders(ordersCopy);
  }

  async function addItems(data) {
    try {
      const { newItems } = await post(`/api/v2/orders/${props.orderId}/items`, data);

      let newOrders = [...orders];
      let newActiveOrder = { ...activeOrder };

      newItems.forEach(newItem => {
        newActiveOrder.items.push(newItem);

        if (newItem.paymentMethod === PAYMENT_METHODS.invoice) {
          // Update the order to not be fully paid (so icon appears)
          newOrders = newOrders.map(order => {
            if (+order.id === +newActiveOrder.id) {
              order.isFullyPaid = "0";
            }
            return order;
          });
        }
      });

      setActiveOrder(newActiveOrder);
      setOrders(newOrders);

      return { success: true, error: "" };
    } catch (errorMessage) {
      return { success: false, error: errorMessage };
    }
  }

  const viewText = isFullyPaid() ? "View Receipt" : "View Invoice";
  const emailText = isFullyPaid() ? "Email Receipt" : "Email Invoice";

  const popoverMenu = (
    <Popover id="popover-trigger-focus">
      <ul role="menu" className="sidepanel__items-tab__more-menu">
        <li
          role="presentation"
          onClick={() => {
            viewReceipt();
          }}
        >
          {viewText}
        </li>
        <li
          role="presentation"
          onClick={() => {
            setShowEmailReceiptModal(true);
          }}
        >
          {emailText}
        </li>
        {renderPayInvoiceButton()}
        <li
          role="presentation"
          className="danger"
          onClick={() => {
            setShowDeleteOrderModal(true);
          }}
        >
          Delete Order
        </li>
      </ul>
    </Popover>
  );

  async function handleChargeAndAddItemsToScreen(paymentMethod, stripe, items) {
    let success = false;
    let error = "";

    if (paymentMethod === PAYMENT_METHODS.creditCard) {
      const response = await stripe.createToken({ type: "card" });

      if (response.error) {
        error = response.error.message;
      } else {
        const resp = await addItems({ paymentMethod, items, tokenId: response.token.id });
        success = resp.success;
        error = resp.error;
      }
    } else {
      const resp = await addItems({ paymentMethod, items, tokenId: null });
      success = resp.success;
      error = resp.error;
    }

    if (success) {
      toggleAddItemsModal();
    }

    return { success, error };
  }

  if (!items) {
    return <Spinner />;
  }

  return (
    <div className="sidepanel__items-tab">
      {renderItemsTable()}

      <Button bsStyle="primary" onClick={toggleAddItemsModal}>
        Add Item
      </Button>

      {props.showOverflowMenu && (
        <OverlayTrigger trigger="focus" placement="top" overlay={popoverMenu}>
          <a href="#" tabIndex="0" className="btn btn-default" data-qa-id="ellipsis-button">
            <span className="glyphicon glyphicon-option-horizontal" />
          </a>
        </OverlayTrigger>
      )}

      <AddItemsModal
        apiKey={props.user.stripePublishableKey}
        availableItems={items}
        chargeAndAddItemsToScreen={handleChargeAndAddItemsToScreen}
        isVisible={showAddItemsModal}
        handleHideAddItemsModal={toggleAddItemsModal}
        stripeId={props.stripeId}
        tax1Name={props.tax1Name}
        tax1Rate={+props.tax1}
        tax2Name={props.tax2Name}
        tax2Rate={+props.tax2}
      />
      <EmailReceiptModal
        isVisible={showEmailReceiptModal}
        isFullyPaid={isFullyPaid()}
        hideEmailReceiptModal={() => {
          setShowEmailReceiptModal(false);
        }}
        orderId={props.orderId}
        afterEmailReceipt={() => {
          setShowEmailReceiptModal(false);
        }}
      />

      <DeleteOrderModal
        isVisible={showDeleteOrderModal}
        hideDeleteOrderModal={() => {
          setShowDeleteOrderModal(false);
        }}
        orderId={props.orderId}
        afterDeleteOrder={afterDeleteOrder}
        paidUsingCreditCard={getPaidUsingCreditCard()}
      />

      <PayOutstandingAmountModal
        apiKey={props.user.stripePublishableKey}
        orderId={props.orderId}
        amount={getAmountUnpaid()}
        stripeId={props.stripeId}
        isVisible={showPayOutstandingAmountModal}
        hideModal={() => {
          setShowPayOutstandingAmountModal(false);
        }}
        onSuccess={newPaymentMethod => {
          handleSuccessfullyPaidOutstanding(newPaymentMethod);
          setShowPayOutstandingAmountModal(false);
        }}
      />
    </div>
  );
}

Items.propTypes = {
  showOverflowMenu: PropTypes.bool,
  orderId: PropTypes.number.isRequired,
  tax1: PropTypes.number,
  tax1Name: PropTypes.string,
  tax2: PropTypes.number,
  tax2Name: PropTypes.string,
  stripeId: PropTypes.string
};

Items.defaultProps = {
  showOverflowMenu: true,
  stripeId: "",
  tax1: 0,
  tax1Name: "",
  tax2: 0,
  tax2Name: ""
};

export default class ItemsWithContext extends React.Component {
  render() {
    return <UserContext.Consumer>{user => <Items {...this.props} user={user} />}</UserContext.Consumer>;
  }
}
