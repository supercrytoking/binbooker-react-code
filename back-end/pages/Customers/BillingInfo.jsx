import React from "react";
import PropTypes from "prop-types";
import { Elements, StripeProvider, injectStripe } from "react-stripe-elements";
import Input from "Components/Input";
import PendingButton from "Components/PendingButton";
import CreditCardFormSection from "Components/CreditCardFormSection";
import { put } from "Utils/services.jsx";

class _CustomerBillingInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      errors: []
    };
  }

  saveBillingInfo = async token => {
    try {
      await put("/api/v2/customers", {
        id: this.props.id,
        token
      });
      this.props.afterSave();
    } catch (errorMessage) {
      this.setState({
        errors: [errorMessage]
      });
    }
    this.setState({ saving: false });
  };

  handleClickSave = () => {
    this.setState({ saving: true, errors: [] });

    this.props.stripe
      .createToken({ type: "card" })
      .then(response => {
        if (response.error) {
          this.setState({ errors: [response.error.message], saving: false });
        } else {
          this.saveBillingInfo(response.token.id);
        }
      })
      .catch(() => {
        // this.setState({ errors: [error.message], saving: false });
      });
  };

  renderSaveButton() {
    return (
      <PendingButton pending={this.state.saving} onClick={this.handleClickSave} text="Save" pendingText="Saving..." />
    );
  }

  renderYears() {
    const years = [];
    for (let i = 0; i < 10; i++) {
      var year = new Date().getFullYear() + i;
      years.push(
        <option key={i} value={year}>
          {year}
        </option>
      );
    }
    return years;
  }

  renderErrors() {
    if (this.state.errors.length > 0) {
      return (
        <div className="alert alert-danger">
          Please fix the following errors and try again:
          <ul>
            {this.state.errors.map((error, index) => (
              <li key={`error${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="customers__sidepanel__billing-info">
        <input type="hidden" name="id" defaultValue={this.props.id} />
        {this.renderErrors()}
        <p>
          <em>
            Update a user's credit card information (stored on Stripe.com) by completing the form below and pressing
            &quot;Save&quot;. No credit card information is saved in the BinBooker.com database.
          </em>
        </p>
        <CreditCardFormSection isDisabled={this.state.saving} />
        <Input label={"Stripe ID"} disabled name="stripeId" onChange={() => {}} value={this.props.stripeId} />
        {this.renderSaveButton()}
      </div>
    );
  }
}

_CustomerBillingInfo.propTypes = {
  id: PropTypes.string.isRequired,
  stripeId: PropTypes.string.isRequired,
  afterSave: PropTypes.func.isRequired
};

const CustomerBillingInfoForm = injectStripe(_CustomerBillingInfo);

class CustomerBillingInfo extends React.Component {
  render() {
    let stripeProps = {};

    if (window.Stripe) {
      stripeProps.apiKey = this.props.apiKey;
    } else {
      stripeProps.stripe = null; //needed for enzyme tests
    }

    return (
      <StripeProvider {...stripeProps}>
        <Elements>
          <CustomerBillingInfoForm {...this.props} />
        </Elements>
      </StripeProvider>
    );
  }
}

CustomerBillingInfo.propTypes = {
  apiKey: PropTypes.string
};

CustomerBillingInfo.defaultProps = {
  apiKey: "null"
};

export default CustomerBillingInfo;
