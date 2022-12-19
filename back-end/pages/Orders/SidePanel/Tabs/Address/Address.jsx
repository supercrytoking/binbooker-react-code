import React from "react";
import PropTypes from "prop-types";
import Input from "Components/Input";
import Select from "Components/Select";
import Textarea from "Components/Textarea";
import PendingButton from "Components/PendingButton";
import Errors from "Components/Errors";
import { put } from "Utils/services.jsx";
import { isValidPoNumber, provinces, states, isValidPostalCode } from "Utils/library.jsx";
import { CURRENCY } from "Utils/constants.jsx";
import "./Address.scss";

export default class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryStreet1: this.props.order.deliveryAddress.deliveryStreet1,
      deliveryCity: this.props.order.deliveryAddress.deliveryCity,
      deliveryPostalCode: this.props.order.deliveryAddress.deliveryPostalCode,
      deliveryProvince: this.props.order.deliveryAddress.deliveryProvince,
      // deliveryCountry: this.props.order.deliveryAddress.deliveryCountry,
      notes: this.props.order.notes,
      poNumber: this.props.order.poNumber,
      errors: [],
      saving: false
    };
  }

  getInvalidError(currency) {
    const properFormat = currency === CURRENCY.CAD ? "A1A 1A1" : "12345";
    const postalCodeText = currency === CURRENCY.CAD ? "postal code" : "zip code";
    return `${this.state.deliveryPostalCode} is an invalid ${postalCodeText}; please enter a ${postalCodeText} in the format: ${properFormat}`;
  }

  handleClickSave = async () => {
    let errors = [];
    this.setState({ saving: true, errors });

    if (this.state.deliveryStreet1.length === 0 || this.state.deliveryStreet1.length > 50) {
      errors.push('"Street address" must be between 1 and 50 characters.');
    }

    if (this.state.deliveryCity.length === 0 || this.state.deliveryCity.length > 50) {
      errors.push('"City" must be between 1 and 50 characters.');
    }

    if (!isValidPostalCode(this.state.deliveryPostalCode, this.props.currency)) {
      errors.push(this.getInvalidError(this.props.currency));
    }

    if (this.state.deliveryProvince.length === 0) {
      errors.push('Please select a "State/Province".');
    }

    if (!isValidPoNumber(this.state.poNumber)) {
      errors.push(
        '"The PO number may only be up to 16 characters and contain: letters, numbers, dashes, commas and periods.'
      );
    }

    if (errors.length > 0) {
      this.setState({
        saving: false,
        errors
      });
      return;
    }

    await put("/api/v1/order.php", {
      id: this.props.order.id,
      deliveryStreet1: this.state.deliveryStreet1,
      deliveryCity: this.state.deliveryCity,
      deliveryPostalCode: this.state.deliveryPostalCode,
      deliveryProvince: this.state.deliveryProvince,
      notes: this.state.notes,
      poNumber: this.state.poNumber
    });

    this.setState({ saving: false });
    this.props.afterSave();
  };

  renderPostalCode() {
    const postalCode = this.props.currency === CURRENCY.CAD ? "Postal Code*" : "Zip Code*";
    return (
      <Input
        name="deliveryPostalCode"
        label={postalCode}
        value={this.state.deliveryPostalCode}
        onChange={e => {
          this.setState({ deliveryPostalCode: e.target.value });
        }}
      />
    );
  }

  renderProvince() {
    const provinceLabel = this.props.currency === CURRENCY.CAD ? "Province*" : "State*";
    const provincesList = this.props.currency === CURRENCY.CAD ? provinces : states;
    return (
      <Select
        name="deliveryProvince"
        label={provinceLabel}
        value={this.state.deliveryProvince}
        options={provincesList}
        onChange={e => {
          this.setState({ deliveryProvince: e.target.value });
        }}
      />
    );
  }

  render() {
    return (
      <div className="sidepanel__address-tab">
        <Errors errors={this.state.errors} onDismiss={() => this.setState({ errors: [] })} />
        <Input
          name="deliveryStreet1"
          label="Street address*"
          value={this.state.deliveryStreet1}
          onChange={e => {
            this.setState({ deliveryStreet1: e.target.value });
          }}
        />
        <Input
          name="deliveryCity"
          label="City*"
          value={this.state.deliveryCity}
          onChange={e => {
            this.setState({ deliveryCity: e.target.value });
          }}
        />
        <div className="address-tab__postal-code-province">
          <div className="address-tab__postal-code">{this.renderPostalCode()}</div>
          <div className="address-tab__province">{this.renderProvince()}</div>
        </div>
        <Textarea
          name="notes"
          label="Where would you like the bin to be placed?"
          value={this.state.notes}
          onChange={e => {
            this.setState({ notes: e.target.value });
          }}
        />
        <Input
          name="poNumber"
          label="PO Number"
          value={this.state.poNumber}
          onChange={e => {
            this.setState({ poNumber: e.target.value });
          }}
        />

        <PendingButton
          pending={this.state.saving}
          onClick={() => {
            this.handleClickSave();
          }}
        />
      </div>
    );
  }
}

Address.propTypes = {
  order: PropTypes.object.isRequired,
  afterSave: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired
};
