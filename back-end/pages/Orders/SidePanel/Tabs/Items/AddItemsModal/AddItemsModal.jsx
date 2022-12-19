import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { Elements, StripeProvider, injectStripe } from "react-stripe-elements";

import { PAYMENT_METHODS } from "Utils/constants.jsx";
import { formatDollarAmount, getUuid } from "Utils/library.jsx";

import Errors from "Components/Errors";
import PendingButton from "Components/PendingButton";
import CreditCardFormSection from "Components/CreditCardFormSection";
import PaymentMethodFormSection from "Components/PaymentMethodFormSection";
import ItemRowHeaders from "./ItemRowHeaders";
import ItemRow from "./ItemRow";
import TaxRow from "./TaxRow";
import "./AddItemsModal.scss";

// This one cant be imported anywhere, as it needs Stripe injected for Payment section. Proper one is lower in code.
function AddItemsModalNoStripe({
  availableItems,
  chargeAndAddItemsToScreen,
  isVisible,
  handleHideAddItemsModal,
  stripe, // this gets injected
  stripeId,
  tax1Name,
  tax1Rate = 0,
  tax2Name,
  tax2Rate = 0
}) {
  function getInitialPaymentMethod() {
    return stripeId.length > 0 ? PAYMENT_METHODS.stripe : PAYMENT_METHODS.creditCard;
  }

  function getNewItemObject() {
    return { id: getUuid(), quantity: 0, selectedItemId: "", unitPrice: 0 };
  }

  const [items, setItems] = React.useState([getNewItemObject()]);
  const [paymentMethod, setPaymentMethod] = React.useState(getInitialPaymentMethod);
  const [allItemRowsAreValid, setAllItemRowsAreValid] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  React.useEffect(() => {
    let valid = true;

    items.forEach(item => {
      if (item.quantity === 0 || item.selectedItemId === "" || item.unitPrice === 0) {
        valid = false;
      }
    });

    if (!items.length) {
      valid = false;
    }

    setAllItemRowsAreValid(valid);
  }, [items]);

  const { subTotal, tax1, tax2, total } = calculateTotals();

  function calculateTotals() {
    let subTotal = 0;
    let tax1 = 0;
    let tax2 = 0;
    let total = 0;

    items.forEach(item => {
      const thisItemsSubTotal = item.unitPrice * item.quantity;

      subTotal += thisItemsSubTotal;
    });

    tax1 = +(subTotal * tax1Rate).toFixed(2);
    tax2 = +(subTotal * tax2Rate).toFixed(2);
    total = +(subTotal + tax1 + tax2).toFixed(2);

    return { subTotal, tax1, tax2, total };
  }

  function getSubmitButtonText() {
    if (total === 0 || paymentMethod === PAYMENT_METHODS.invoice) {
      return "Add Items";
    }

    switch (paymentMethod) {
      case PAYMENT_METHODS.creditCard:
      case PAYMENT_METHODS.stripe:
        return total > 0 ? "Charge credit card and add Items" : "Refund credit card and add Items";
      default:
        return "Record Payment and add Items";
    }
  }

  function getItemIndex(itemId) {
    return items.findIndex(item => item.id === itemId);
  }

  function handleChangeForm(itemId, e) {
    const indexToUpdate = getItemIndex(itemId);
    const newItems = [...items];
    newItems[indexToUpdate][e.target.name] = +e.target.value;

    if (e.target.name === "selectedItemId") {
      if (e.target.value === "") {
        newItems[indexToUpdate].unitPrice = 0;
      } else {
        newItems[indexToUpdate].unitPrice = +e.target.options[e.target.selectedIndex].getAttribute("data-unit-price");
      }
    }
    setItems(newItems);
  }

  function handleAddItem() {
    const newItems = [...items];
    newItems.push(getNewItemObject());
    setItems(newItems);
  }

  function handleRemoveItem(itemId) {
    const indexToRemove = getItemIndex(itemId);
    const newItems = [...items];
    newItems.splice(indexToRemove, 1);
    setItems(newItems);
  }

  async function handleClickCharge() {
    setIsProcessing(true);
    const tempPaymentMethod = total === 0 ? PAYMENT_METHODS.cash : paymentMethod; // if the total is zero, there is no 'stripe' component on screen and the paymentMethod is 'credit card' by default. but that kills app. set it to "cash", since just need to keep a record of it.
    const { success, error } = await chargeAndAddItemsToScreen(tempPaymentMethod, stripe, items);

    if (success) {
      // reset everything, and the parent will close the modal
      setItems([getNewItemObject()]);
      setPaymentMethod(getInitialPaymentMethod());
      setAllItemRowsAreValid(false);
      setErrors([]);
    } else {
      setErrors([error]);
    }

    setIsProcessing(false);
  }

  function renderPaymentSection() {
    if (total === 0) {
      return null;
    }

    return (
      <React.Fragment>
        <PaymentMethodFormSection
          isDisabled={isProcessing}
          onChange={paymentMethod => {
            setPaymentMethod(paymentMethod);
          }}
          onChangePoNumber={() => {}}
          paymentMethod={paymentMethod}
          allowStripe={stripeId.length > 0}
          allowInvoice
        />
        {paymentMethod === PAYMENT_METHODS.creditCard && <CreditCardFormSection isDisabled={isProcessing} />}
      </React.Fragment>
    );
  }

  return (
    <Modal className="add-items-modal" show={isVisible} onHide={handleHideAddItemsModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Items to Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Errors errors={errors} onDismiss={() => setErrors([])} onTop={false} />
        <ItemRowHeaders />
        {items.map(item => (
          <ItemRow
            availableItems={availableItems}
            isDisabled={isProcessing}
            onChangeForm={e => {
              handleChangeForm(item.id, e);
            }}
            onClickRemove={() => handleRemoveItem(item.id)}
            key={item.id}
            quantity={item.quantity}
            selectedItemId={+item.selectedItemId}
            unitPrice={item.unitPrice}
          />
        ))}
        <button className="add-item btn btn-link" disabled={isProcessing} onClick={handleAddItem}>
          Add another Item
        </button>
        <div className="row text-right">
          <div className="col-xs-9">Sub-total:</div>
          <div className="col-xs-3" id="subtotal">
            {formatDollarAmount(subTotal)}
          </div>
          <TaxRow name={tax1Name} amount={tax1} />
          <TaxRow name={tax2Name} amount={tax2} />
          <div className="total">
            <div className="col-xs-9">Total:</div>
            <div className="col-xs-3" id="total">
              {formatDollarAmount(total)}
            </div>
          </div>
        </div>
        <hr />
        {renderPaymentSection()}
      </Modal.Body>
      <Modal.Footer>
        <PendingButton
          disabled={!allItemRowsAreValid}
          pending={isProcessing}
          onClick={handleClickCharge}
          text={getSubmitButtonText()}
          pendingText="Processing..."
          bsStyle="success"
        />
      </Modal.Footer>
    </Modal>
  );
}

AddItemsModalNoStripe.propTypes = {
  availableItems: PropTypes.array.isRequired,
  chargeAndAddItemsToScreen: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
  handleHideAddItemsModal: PropTypes.func.isRequired,
  stripe: PropTypes.object.isRequired, // this gets injected
  stripeId: PropTypes.string.isRequired,
  tax1Name: PropTypes.string,
  tax1Rate: PropTypes.number,
  tax2Name: PropTypes.string,
  tax2Rate: PropTypes.number
};

AddItemsModalNoStripe.defaultProps = {
  isVisible: false,
  tax1Name: "",
  tax1Rate: 0,
  tax2Name: "",
  tax2Rate: 0
};

const AddItemsModalWithStripe = injectStripe(AddItemsModalNoStripe);

// This one can be imported by stories and tests. It injects Stripe but has no 'availableItems', so they have to be passed in.
export default function AddItemsModal({ apiKey = "null", ...moreProps }) {
  let stripeProps = {};

  if (window.Stripe) {
    stripeProps.apiKey = apiKey;
  } else {
    stripeProps.stripe = null; //needed for enzyme tests
  }

  return (
    <StripeProvider {...stripeProps}>
      <Elements>
        <AddItemsModalWithStripe {...moreProps} />
      </Elements>
    </StripeProvider>
  );
}
