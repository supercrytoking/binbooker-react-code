// TODO: If you change something (like max jobs), then go to a different tab, you dont see those changes until
//       you log in again. The other tab gets data from AppProvider  If I wanted to use that same appoach, I'd have to move
//       all of this stuff into the AppProvider:
//          user data
//          onChangeInput
//          saveUser
//          error/error handling

import React, { Component } from "react";
import { Tabs, Tab, Alert } from "react-bootstrap";
import { UserContext } from "../../UserProvider.jsx";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import CompanyDetails from "./CompanyDetails.jsx";
import Billing from "./Billing.jsx";
import QuickBooks from "./QuickBooks";
import Scheduling from "./Scheduling.jsx";
import Content from "./Content.jsx";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import PendingButton from "Components/PendingButton";
import { get, post } from "Utils/services.jsx";
import "./index.scss";

const SETTINGS_ENDPOINT = "/api/v2/user";

export default class SettingsPage extends Component {
  constructor() {
    super();

    this.state = {
      settings: {},
      isSaving: false,
      errorMessage: ""
    };

    this.requiredFields = [
      "companyName",
      "address1",
      "city",
      "province",
      "postalCode",
      "phone",
      "url",
      "email",
      "currency",
      "stripeSecretKeyLive",
      "stripePublishableKeyLive",
      "stripeSecretKeyTest",
      "stripePublishableKeyTest",
      "maxJobsMonday",
      "maxJobsTuesday",
      "maxJobsWednesday",
      "maxJobsThursday",
      "maxJobsFriday",
      "maxJobsSaturday",
      "maxJobsSunday"
    ];
  }

  componentDidMount() {
    document.title = "Settings";
    this.getSettings();
  }

  getSettings = async () => {
    const settings = await get(SETTINGS_ENDPOINT);
    this.setState({ settings });
  };

  getErrorMessage(settings) {
    let errorMessages = [];

    this.requiredFields.map(name => {
      if (settings[name] == "") {
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        errorMessages.push(`'${capitalizedName}' cannot be blank.`);
      }
    });

    if (
      (this.state.settings.tax1Name.length && !this.state.settings.tax1) ||
      (this.state.settings.tax1Name.length === 0 && this.state.settings.tax1 > 0)
    ) {
      errorMessages.push("You must enter both a Tax 1 Name and Rate (or leave both blank).");
    }

    if (this.state.settings.tax1 < 0) {
      errorMessages.push("Tax 1 Rate must be greater than zero.");
    }

    if (
      (this.state.settings.tax2Name.length && !this.state.settings.tax2) ||
      (this.state.settings.tax2Name.length === 0 && this.state.settings.tax2 > 0)
    ) {
      errorMessages.push("You must enter both a Tax 2 Name and Rate (or leave both blank).");
    }

    if (this.state.settings.tax2 < 0) {
      errorMessages.push("Tax 2 Rate must be greater than zero.");
    }

    if (
      (this.state.settings.taxRegistrationTitle && !this.state.settings.taxRegistrationValue) ||
      (!this.state.settings.taxRegistrationTitle && this.state.settings.taxRegistrationValue)
    ) {
      errorMessages.push("You must enter both a Tax registration Title and Value (or leave both blank).");
    }

    if (this.state.settings.maxJobsMonday < 0 || this.state.settings.maxJobsMonday > 23) {
      errorMessages.push("'Max jobs Monday' must be between zero and 23.");
    }

    if (this.state.settings.maxJobsTuesday < 0 || this.state.settings.maxJobsTuesday > 23) {
      errorMessages.push("'Max jobs Tuesday' must be between zero and 23.");
    }

    if (this.state.settings.maxJobsWednesday < 0 || this.state.settings.maxJobsWednesday > 23) {
      errorMessages.push("'Max jobs Wednesday' must be between zero and 23.");
    }

    if (this.state.settings.maxJobsThursday < 0 || this.state.settings.maxJobsThursday > 23) {
      errorMessages.push("'Max jobs Thursday' must be between zero and 23.");
    }

    if (this.state.settings.maxJobsFriday < 0 || this.state.settings.maxJobsFriday > 23) {
      errorMessages.push("'Max jobs Friday' must be between zero and 23.");
    }

    if (this.state.settings.maxJobsSaturday < 0 || this.state.settings.maxJobsSaturday > 23) {
      errorMessages.push("'Max jobs Saturday' must be between zero and 23.");
    }

    if (this.state.settings.maxJobsSunday < 0 || this.state.settings.maxJobsSunday > 23) {
      errorMessages.push("'Max jobs Sunday' must be between zero and 23.");
    }

    return errorMessages;
  }

  handleSubmit = async () => {
    const { settings } = this.state;
    const errorMessages = this.getErrorMessage(settings);

    if (errorMessages.length) {
      let errorMessage = (
        <span>
          Please fix the following errors:
          <ul>
            {errorMessages.map((errorMessage, index) => (
              <li key={index}>{errorMessage}</li>
            ))}
          </ul>
        </span>
      );
      window.scrollTo(0, 0);
      this.setState({ errorMessage });
      return null;
    }

    this.setState({ errorMessage: "", isSaving: true });
    await post(SETTINGS_ENDPOINT, settings);
    this.setState({ isSaving: false });
  };

  handleChange = async (value, name) => {
    const { settings } = this.state;
    settings[name] = value;
    this.setState({ settings });
  };

  renderSaveButton = () => (
    <PendingButton onClick={this.handleSubmit} pending={this.state.isSaving} saving={this.state.isSaving} />
  );

  render() {
    const { settings, errorMessage } = this.state;
    return (
      <UserContext.Consumer>
        {user => (
          <LoggedInStaffContext.Consumer>
            {loggedInStaff => {
              if (!loggedInStaff.pageAccess.manageSettings) {
                return null;
              }

              if (this.state.settings === {}) {
                return <SpinnerCentred />;
              }

              return (
                <div className="settings-page">
                  {Object.keys(this.state.settings).length ? (
                    <div>
                      <Tabs defaultActiveKey="CompanyDetails" id="settingsTab">
                        {errorMessage ? <Alert bsStyle={"danger"}>{errorMessage}</Alert> : null}

                        <Tab eventKey="CompanyDetails" title="Company Details">
                          <CompanyDetails
                            settings={settings}
                            currency={user.currency}
                            handleChange={this.handleChange}
                            isSaving={this.state.isSaving}
                          />
                          {this.renderSaveButton()}
                        </Tab>
                        <Tab eventKey="Billing" title="Billing">
                          <Billing
                            settings={settings}
                            handleChange={this.handleChange}
                            isSaving={this.state.isSaving}
                          />
                          {this.renderSaveButton()}
                        </Tab>
                        <Tab eventKey="Scheduling" title="Scheduling">
                          <Scheduling
                            settings={settings}
                            handleChange={this.handleChange}
                            isSaving={this.state.isSaving}
                          />
                          {this.renderSaveButton()}
                        </Tab>
                        <Tab eventKey="Content" title="Content">
                          <Content
                            currency={user.currency}
                            settings={settings}
                            handleChange={this.handleChange}
                            isSaving={this.state.isSaving}
                          />
                          {this.renderSaveButton()}
                        </Tab>
                        <Tab eventKey="QuickBooks" title="QuickBooks">
                          <QuickBooks qbAccessToken={user.qbAccessToken} qbIsSyncing={!!+user.qbIsSyncing} />
                        </Tab>
                      </Tabs>
                    </div>
                  ) : null}
                </div>
              );
            }}
          </LoggedInStaffContext.Consumer>
        )}
      </UserContext.Consumer>
    );
  }
}
