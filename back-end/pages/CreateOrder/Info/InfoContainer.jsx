import React from "react";
import PropTypes from "prop-types";
import { UserContext } from "../../../UserProvider.jsx";
import SearchContainer from "./Search/SearchContainer.jsx";
import { CURRENCY } from "Utils/constants.jsx";
import { isValidEmail } from "Utils/library.jsx";
import { get } from "Utils/services.jsx";
import Info from "./Info.jsx";

export default function InfoContainer({ customer, isBackEnd, onChange, onClickBack, onValidContinue, postalCode }) {
  const user = React.useContext(UserContext);
  const [errors, setErrors] = React.useState(null);
  const [isSameChecked, setIsSameChecked] = React.useState(true);

  React.useEffect(() => {
    // compare delievery address and billing address to set checked status
    if (
      customer.deliveryStreet1 === customer.billingStreet1 &&
      customer.deliveryCity === customer.billingCity &&
      customer.deliveryProvince === customer.billingProvince
    ) {
      setIsSameChecked(true);
    } else {
      setIsSameChecked(false);
    }
  }, []);

  async function handleOnValidContinue() {
    let errors = [];

    customer.firstName = customer.firstName.trim();
    customer.lastName = customer.lastName.trim();

    if (customer.firstName === "") {
      errors.push("First Name cannot be blank");
    }
    if (customer.lastName === "") {
      errors.push("Last Name cannot be blank");
    }
    if (customer.billingStreet1 === "") {
      errors.push("Billing Street Address cannot be blank");
    }
    if (customer.billingCity === "") {
      errors.push("Billing City cannot be blank");
    }
    if (customer.billingProvince === "") {
      if (user.currency === CURRENCY.CAD) {
        errors.push("Billing Province cannot be blank");
      } else {
        errors.push("Billing State cannot be blank");
      }
    }
    if (customer.billingPostalCode === "") {
      if (user.currency === CURRENCY.CAD) {
        errors.push("Billing Postal Code cannot be blank");
      } else {
        errors.push("Billing Zip Code cannot be blank");
      }
    }
    if (customer.phone === "") {
      errors.push("Phone Number cannot be blank");
    }
    if (!isValidEmail(customer.email)) {
      errors.push("Please enter a valid Email Address.");
    }
    if (customer.deliveryStreet1 === "") {
      errors.push("Delivery Street Address cannot be blank");
    }
    if (customer.deliveryCity === "") {
      errors.push("Delivery City cannot be blank");
    }
    if (customer.deliveryProvince === "") {
      if (user.currency === CURRENCY.CAD) {
        errors.push("Delivery Province cannot be blank");
      } else {
        errors.push("Delivery State cannot be blank");
      }
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    if (isBackEnd && !customer.id) {
      const response = await get(`/api/v2/customers?email=${customer.email}`);

      if (response.found) {
        setErrors([
          "The email address you entered is already in use but you did not load the customer it belongs to. Email addresses must be unique for each customer, so either: load the existing customer using the search box (if this is a customer who has ordered before), or use a unique email address (if this is a new customer)."
        ]);
        return;
      }
    }

    onValidContinue();
  }

  function handleClickUnload() {
    const newCustomer = Object.assign({}, customer);

    Object.keys(newCustomer).forEach(key => {
      switch (key) {
        case "billingProvince":
        case "deliveryProvince":
        case "deliveryPostalCode":
          break;
        default:
          newCustomer[key] = "";
          break;
      }
    });

    onChange(newCustomer);
  }

  function handleClickCustomer(clickedCustomer) {
    const newCustomer = Object.assign({}, clickedCustomer);
    let deliveryStreet1 = "";
    let deliveryCity = "";
    let deliveryProvince = "";
    let driverNotes = "";

    if (newCustomer.orders.length) {
      const lastOrderIndex = newCustomer.orders.length - 1;

      // only pre-populate the delivery address if their last order went to their own address
      if (newCustomer.orders[lastOrderIndex].deliveryStreet1 === newCustomer.billingStreet1) {
        deliveryStreet1 = newCustomer.orders[lastOrderIndex].deliveryStreet1;
        deliveryCity = newCustomer.orders[lastOrderIndex].deliveryCity;
        deliveryProvince = newCustomer.orders[lastOrderIndex].deliveryProvince;
        driverNotes = newCustomer.orders[lastOrderIndex].notes;
        setIsSameChecked(true);
      } else {
        setIsSameChecked(false);
        deliveryProvince = newCustomer.billingProvince;
      }
    } else {
      setIsSameChecked(true);
      deliveryStreet1 = newCustomer.billingStreet1;
      deliveryCity = newCustomer.billingCity;
      deliveryProvince = newCustomer.billingProvince;
    }

    newCustomer.deliveryStreet1 = deliveryStreet1;
    newCustomer.deliveryCity = deliveryCity;
    newCustomer.deliveryProvince = deliveryProvince;
    newCustomer.deliveryPostalCode = postalCode;
    newCustomer.driverNotes = driverNotes;

    delete newCustomer.orders;
    onChange(newCustomer);
  }

  function handleOnClickIsSame() {
    // they just turned it on, so copy the address data
    // note: this has to go before setIsSameChecked
    if (!isSameChecked) {
      onChange(customer, true);
    }

    setIsSameChecked(!isSameChecked);
  }

  function handleOnChange(customer) {
    onChange(customer, isSameChecked);
  }

  return (
    <Info
      currency={user.currency}
      customer={customer}
      customUserText={user.infoText}
      errors={errors}
      isBackEnd={isBackEnd}
      isSameChecked={isSameChecked}
      onChange={handleOnChange}
      onClickBack={onClickBack}
      onClickIsSame={handleOnClickIsSame}
      onValidContinue={handleOnValidContinue}
    >
      <div className="create-order__info__customer-search">
        <p>Search for an existing customer, or enter a new customer&apos;s contact and billing info below:</p>
        <SearchContainer
          onClickCustomer={handleClickCustomer}
          onClickUnload={handleClickUnload}
          showUnload={!!customer.id}
        />
      </div>
    </Info>
  );
}

InfoContainer.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    stripeId: PropTypes.string,

    firstName: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    notes: PropTypes.string,

    deliveryStreet1: PropTypes.string,
    deliveryCity: PropTypes.string,
    deliveryPostalCode: PropTypes.string,
    deliveryProvince: PropTypes.string,
    driverNotes: PropTypes.string,

    billingStreet1: PropTypes.string,
    billingStreet2: PropTypes.string,
    billingPostalCode: PropTypes.string,
    billingProvince: PropTypes.string
  }).isRequired,
  isBackEnd: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  onValidContinue: PropTypes.func.isRequired,
  postalCode: PropTypes.string.isRequired
};

InfoContainer.defaultProps = {
  isBackEnd: false
};
