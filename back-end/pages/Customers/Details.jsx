import React from "react";
import PropTypes from "prop-types";
import Input from "Components/Input";
import Select from "Components/Select";
import Textarea from "Components/Textarea";
import PendingButton from "Components/PendingButton";
import { provinces, states, scrollToTopOfSidepanel } from "Utils/library.jsx";
import { put } from "Utils/services.jsx";
import Errors from "Components/Errors";

export default class CustomerDetails extends React.Component {
  constructor(props) {
    super(props);
    // TODO: setting state to props is a red flag...
    this.state = {
      saving: false,
      errors: [],
      id: props.id,
      companyName: props.companyName,
      firstName: props.firstName,
      lastName: props.lastName,
      phone: props.phone,
      email: props.email,
      billingStreet1: props.billingStreet1,
      billingCity: props.billingCity,
      billingPostalCode: props.billingPostalCode,
      billingProvince: props.billingProvince,
      billingCountry: props.billingCountry,
      notes: props.notes
    };
  }

  handleClickSave = async () => {
    let errors = [];

    const firstName = this.state.firstName.trim();
    const lastName = this.state.lastName.trim();
    this.setState({ saving: true, firstName, lastName, errors });

    if (this.state.companyName.length > 50) {
      errors.push('"Company name" cannot be longer than 50 characters.');
    }

    if (firstName.length === 0 || firstName.length > 50) {
      errors.push('"First name" must be between 1 and 50 characters.');
    }

    if (lastName.length === 0 || lastName.length > 50) {
      errors.push('"Last name" must be between 1 and 50 characters.');
    }

    if (this.state.phone.length === 0 || this.state.phone.length > 50) {
      errors.push('"Phone number" must be between 1 and 50 characters.');
    }

    if (this.state.email.length === 0 || this.state.email.length > 100) {
      errors.push('"Email address" must be between 1 and 100 characters.');
    }

    if (this.state.billingStreet1.length === 0 || this.state.billingStreet1.length > 100) {
      errors.push('"Street address" must be between 1 and 100 characters.');
    }

    if (this.state.billingCity.length === 0 || this.state.billingCity.length > 50) {
      errors.push('"City" must be between 1 and 50 characters.');
    }

    if (this.state.billingPostalCode.length === 0 || this.state.billingPostalCode.length > 50) {
      errors.push('"Postal Code" must be between 1 and 50 characters.');
    }

    if (this.state.notes.length > 65000) {
      errors.push('"Notes" cannot be longer than 65,000 characters.');
    }

    if (errors.length > 0) {
      this.setState({
        saving: false,
        errors
      });
      return;
    }

    try {
      await put("/api/v2/customers", {
        id: this.props.id,
        companyName: this.state.companyName,
        firstName,
        lastName,
        phone: this.state.phone,
        email: this.state.email,
        billingStreet1: this.state.billingStreet1,
        billingCity: this.state.billingCity,
        billingPostalCode: this.state.billingPostalCode,
        billingProvince: this.state.billingProvince,
        billingCountry: this.state.billingCountry,
        notes: this.state.notes
      });

      this.setState({
        errors: []
      });
      this.props.afterSave();
    } catch (errorMessage) {
      this.setState({
        errors: [`Not saved: ${errorMessage}`]
      });
      scrollToTopOfSidepanel();
    }

    this.setState({
      saving: false
    });
  };

  renderPostalCode() {
    const postalCode = this.props.currency === "CAD" ? "Postal Code*" : "Zip Code*";
    return (
      <Input
        name="billingPostalCode"
        label={postalCode}
        value={this.state.billingPostalCode}
        onChange={e => {
          this.setState({ billingPostalCode: e.target.value });
        }}
      />
    );
  }

  renderProvince() {
    const provinceLabel = this.props.currency === "CAD" ? "Province*" : "State*";
    const provincesList = this.props.currency === "CAD" ? provinces : states;
    return (
      <Select
        name="billingProvince"
        label={provinceLabel}
        value={this.state.billingProvince}
        options={provincesList}
        onChange={e => {
          this.setState({ billingProvince: e.target.value });
        }}
      />
    );
  }

  render() {
    return (
      <div className="customer-details-tab">
        <input type="hidden" name="id" defaultValue={this.props.id} />
        <Errors errors={this.state.errors} onDismiss={() => this.setState({ errors: [] })} />
        <Input
          name="companyName"
          label="Company"
          value={this.state.companyName}
          onChange={e => {
            this.setState({ companyName: e.target.value });
          }}
        />

        <div className="customers__full-name">
          <div className="customers__first-name">
            <Input
              name="firstName"
              label="First name*"
              value={this.state.firstName}
              onChange={e => {
                this.setState({ firstName: e.target.value });
              }}
            />
          </div>
          <div className="customers__last-name">
            <Input
              name="lastName"
              label="Last name*"
              value={this.state.lastName}
              onChange={e => {
                this.setState({ lastName: e.target.value });
              }}
            />
          </div>
        </div>

        <Input
          name="phone"
          label="Phone*"
          value={this.state.phone}
          onChange={e => {
            this.setState({ phone: e.target.value });
          }}
        />
        <Input
          name="email"
          label="Email*"
          value={this.state.email}
          onChange={e => {
            this.setState({ email: e.target.value });
          }}
        />
        <Input
          name="billingStreet1"
          label="Street address*"
          value={this.state.billingStreet1}
          onChange={e => {
            this.setState({ billingStreet1: e.target.value });
          }}
        />
        <Input
          name="billingCity"
          label="City*"
          value={this.state.billingCity}
          onChange={e => {
            this.setState({ billingCity: e.target.value });
          }}
        />
        <div className="customers__postal-code-and-province">
          <div className="customers__postal-code">{this.renderPostalCode()}</div>
          <div className="customers__province">{this.renderProvince()}</div>
        </div>
        <Textarea
          name="notes"
          label="Notes"
          value={this.state.notes}
          onChange={e => {
            this.setState({ notes: e.target.value });
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

CustomerDetails.propTypes = {
  id: PropTypes.number.isRequired,
  companyName: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  billingStreet1: PropTypes.string.isRequired,
  billingCity: PropTypes.string.isRequired,
  billingPostalCode: PropTypes.string.isRequired,
  billingProvince: PropTypes.string.isRequired,
  billingCountry: PropTypes.string.isRequired,
  notes: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  afterSave: PropTypes.func.isRequired
};
