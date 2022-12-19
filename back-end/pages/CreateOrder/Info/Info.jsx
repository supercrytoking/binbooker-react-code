import React from "react";
import PropTypes from "prop-types";
import CustomUserText from "../components/CustomUserText/CustomUserText.jsx";
import CreateOrderActionBar from "../components/ActionBar/create-order-action-bar.jsx";
import Input from "Components/Input";
import Select from "Components/Select";
import "./Info.scss";
import { CURRENCY } from "Utils/constants.jsx";
import { provinces, scrollToTop, states } from "Utils/library.jsx";

export default function Info({
  children,
  currency,
  customer,
  customUserText,
  errors,
  isBackEnd,
  isSameChecked,
  onChange,
  onClickBack,
  onClickIsSame,
  onValidContinue
}) {
  React.useEffect(() => {
    document.title = `Rent a dumpster | Info`;
    scrollToTop();
  }, []);

  React.useEffect(scrollToTop, [errors]);

  const provinceOptions = currency === CURRENCY.CAD ? provinces : states;

  function handleChangeField(e, fieldName) {
    let customerObj = customer;
    customerObj[fieldName] = e.target.value;
    onChange(customerObj);
  }

  function renderRow(label, name, isReadOnly = false) {
    return (
      <Input
        disabled={isReadOnly}
        label={label}
        name={name}
        onChange={e => {
          handleChangeField(e, name);
        }}
        type="text"
        value={customer[name]}
      />
    );
  }

  function renderForm() {
    let province = currency === CURRENCY.CAD ? "Province*" : "State*";
    let postalCode = currency === CURRENCY.CAD ? "Postal Code*" : "Zip Code*";
    const deliveryAddressIsSameClass = isSameChecked ? "delivery-address--is-same" : "";

    return (
      <div className="create-order__info-form form">
        <div className="row">
          <label className="control-label create-order__step-label">Enter your information:</label>
        </div>
        <CustomUserText text={customUserText} />
        {renderErrors()}

        <div className="row">
          <div className="col-md-6">
            <h4>Billing Information</h4>
            {renderRow("Company Name", "companyName")}

            <div className="row">
              <div className="col-xs-6 no-padding">
                <div className="row">
                  <label htmlFor="firstName" className="control-label">
                    First Name*
                  </label>
                </div>
                <div className="row">
                  <input
                    name="firstName"
                    id="firstName"
                    className="form-control"
                    value={customer.firstName}
                    onChange={e => {
                      handleChangeField(e, "firstName");
                    }}
                  />
                </div>
              </div>
              <div className="col-xs-6 no-padding">
                <div className="row">
                  <label htmlFor="lastName" className="control-label">
                    Last Name*
                  </label>
                </div>
                <div className="row">
                  <input
                    name="lastName"
                    id="lastName"
                    className="form-control"
                    value={customer.lastName}
                    onChange={e => {
                      handleChangeField(e, "lastName");
                    }}
                  />
                </div>
              </div>
            </div>

            {renderRow("Street Address*", "billingStreet1")}

            <div className="row">
              <div className="col-xs-6 no-padding">
                <div className="row">
                  <label htmlFor="billingCity" className="control-label">
                    City*
                  </label>
                </div>
                <div className="row">
                  <input
                    name="billingCity"
                    id="billingCity"
                    className="form-control"
                    value={customer.billingCity}
                    onChange={e => {
                      handleChangeField(e, "billingCity");
                    }}
                  />
                </div>
              </div>
              <div className="col-xs-6 no-padding">
                <div className="row">
                  <label htmlFor="billingPostalCode" className="control-label">
                    {postalCode}
                  </label>
                </div>
                <div className="row">
                  <input
                    name="billingPostalCode"
                    id="billingPostalCode"
                    className="form-control"
                    value={customer.billingPostalCode}
                    onChange={e => {
                      handleChangeField(e, "billingPostalCode");
                    }}
                  />
                </div>
              </div>
            </div>
            <Select
              name="billingProvince"
              label={province}
              value={customer.billingProvince}
              options={provinceOptions}
              onChange={e => {
                handleChangeField(e, "billingProvince");
              }}
              disabled={false}
            />
            {renderRow("Phone Number*", "phone")}
            {renderRow("Email Address*", "email", !!customer.id)}
            {isBackEnd ? (
              <React.Fragment>
                <div className="row">
                  <label htmlFor="customerNotes" className="control-label">
                    Customer Notes
                  </label>
                </div>
                <div className="row">
                  <textarea
                    name="customerNotes"
                    id="customerNotes"
                    className="form-control"
                    value={customer.notes}
                    onChange={e => {
                      handleChangeField(e, "notes");
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}
          </div>
          <div className="col-md-6">
            <h4>Deliver To</h4>
            <div className="row is-same-wrapper">
              <label>
                <input type="checkbox" checked={isSameChecked} onChange={onClickIsSame} />
                Delivery Address is the same as the Billing Address
              </label>
            </div>
            <div className={`delivery-address ${deliveryAddressIsSameClass}`}>
              {renderRow("Street Address*", "deliveryStreet1")}

              <div className="row">
                <div className="col-md-6 no-padding">{renderRow("City*", "deliveryCity")}</div>
                <div className="col-md-6 no-padding">{renderRow(`${postalCode}`, "deliveryPostalCode", true)}</div>
              </div>
              <Select
                name="deliveryProvince"
                label={province}
                value={customer.deliveryProvince}
                options={provinceOptions}
                onChange={e => {
                  handleChangeField(e, "deliveryProvince");
                }}
                disabled={false}
              />
            </div>
            <div className="row">
              <label htmlFor="driverNotes" className="control-label">
                Where would you like the dumpster to be placed?
              </label>
            </div>
            <div className="row">
              <textarea
                name="driverNotes"
                id="driverNotes"
                className="form-control"
                value={customer.driverNotes}
                onChange={e => {
                  handleChangeField(e, "driverNotes");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderErrors() {
    if (!errors || !errors.length) {
      return null;
    }

    if (errors.length === 1) {
      return <div className="create-order__info__errors alert alert-danger">{errors}</div>;
    }

    const errorsMarkup = errors.map((error, i) => <li key={`info-error-${i}`}>{error}</li>);

    return (
      <div className="create-order__info__errors alert alert-danger">
        The following errors have occurred:<ul>{errorsMarkup}</ul>
      </div>
    );
  }

  return (
    <div className="create-order__info">
      {isBackEnd && children}
      {renderForm()}
      <CreateOrderActionBar onClickContinue={onValidContinue} onClickBack={onClickBack} />
    </div>
  );
}

Info.propTypes = {
  children: PropTypes.node, // the customer search, if it should appear
  currency: PropTypes.string.isRequired,
  customer: PropTypes.object.isRequired,
  customUserText: PropTypes.string,
  errors: PropTypes.array,
  isBackEnd: PropTypes.bool,
  isSameChecked: PropTypes.bool,
  onClickBack: PropTypes.func.isRequired,
  onValidContinue: PropTypes.func.isRequired,
  onClickIsSame: PropTypes.func.isRequired
};

Info.defaultProps = {
  children: null,
  customUserText: "",
  errors: [],
  isBackEnd: false,
  isSameChecked: true
};
