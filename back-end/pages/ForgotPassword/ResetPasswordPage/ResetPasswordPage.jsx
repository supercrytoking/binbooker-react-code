import React from "react";
import { FormGroup, ControlLabel, FormControl, HelpBlock } from "react-bootstrap";
import { post } from "Utils/services.jsx";
import { getParameterByName } from "Utils/library.jsx";
import PendingButton from "Components/PendingButton";
import Errors from "Components/Errors";
import "../ForgotPasswordApp.scss";

const MINIMUM_REQUIRED_PASSWORD_STRENGTH = 5;

export default class ResetPasswordPage extends React.Component {
  componentDidMount() {
    document.title = "Reset Password";
  }

  state = {
    confirmPassword: "",
    confirmPasswordError: null,
    didSubmit: false,
    globalError: "",
    isSubmitting: false,
    newPassword: "",
    newPasswordError: null
  };

  stringIncludesSomethingFromSet(string, set) {
    let found = false;
    string.split("").forEach(char => {
      if (set.indexOf(char) > -1) {
        found = true;
      }
    });

    return found;
  }

  stringIncludesSymbol(string) {
    const symbols = "~!@#$%^&*()_+`-=[{]}|;:'\",<.>/?";
    return this.stringIncludesSomethingFromSet(string, symbols);
  }

  stringIncludesNumber(string) {
    const numbers = "1234567890";
    return this.stringIncludesSomethingFromSet(string, numbers);
  }

  stringIncludesUppercase(string) {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return this.stringIncludesSomethingFromSet(string, uppercase);
  }

  stringIncludesLowercase(string) {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    return this.stringIncludesSomethingFromSet(string, lowercase);
  }

  passwordIsStrongEnough(string) {
    let score = 0;
    const includesSymbol = this.stringIncludesSymbol(string);
    const includesNumber = this.stringIncludesNumber(string);
    const includesUpperAndLowercase = this.stringIncludesUppercase(string) && this.stringIncludesLowercase(string);

    if (includesSymbol || includesNumber || includesUpperAndLowercase) {
      score = string.length - 5; //has to be at least 9 chars
    } else {
      score = string.length - 6; //has to be at least 11 chars
    }

    if (score < 0) {
      score = 0;
    }

    if (includesSymbol) {
      score += 1;
    }

    if (includesNumber) {
      score += 1;
    }

    if (includesUpperAndLowercase) {
      score += 1;
    }

    return score >= MINIMUM_REQUIRED_PASSWORD_STRENGTH;
  }

  handleSubmit = async () => {
    this.setState({ globalError: "", isSubmitting: true });

    try {
      await post("/api/v2/reset-password", {
        hash: encodeURIComponent(getParameterByName("hash")),
        // password: encodeURIComponent(this.state.newPassword) // if do this, have to do it on the login form too, and that will break people's logins
        password: this.state.newPassword
      });
      this.setState({ confirmPassword: "", didSubmit: true, isSubmitting: false, newPassword: "" });
    } catch (errorMessage) {
      this.setState({ globalError: errorMessage, isSubmitting: false });
    }
  };

  handleChangeNewPassword = e => {
    const newPassword = e.target.value;
    const passwordIsStrongEnough = this.passwordIsStrongEnough(newPassword);
    let newPasswordError = null;

    if (!passwordIsStrongEnough) {
      newPasswordError =
        "This password is not strong enough. Make it longer and/or add numbers, symbols and a mix of uppercase & lowercase characters.";
    }

    this.setState({ newPassword, newPasswordError });
    this.handlePasswordsDontMatch(newPassword, this.state.confirmPassword);
  };

  handleChangeConfirmPassword = e => {
    const confirmPassword = e.target.value;
    this.handlePasswordsDontMatch(this.state.newPassword, confirmPassword);
    this.setState({ confirmPassword });
  };

  handlePasswordsDontMatch = (password1, confirmPassword) => {
    if (password1 === confirmPassword || confirmPassword === "") {
      this.setState({ confirmPasswordError: null });
    } else {
      this.setState({ confirmPasswordError: "Passwords do not match." });
    }
  };

  renderConfirmation = () => {
    return (
      <React.Fragment>
        <h1>Password reset!</h1>
        <p>
          You can now use your new password to login. <a href="login">Return to the Login Page</a>.
        </p>
      </React.Fragment>
    );
  };

  renderForm = () => {
    const newPasswordState = this.state.newPasswordError ? "error" : null;
    const confirmPasswordState = this.state.confirmPasswordError ? "error" : null;
    const isSubmitButtonDisabled =
      this.state.newPassword.length === 0 ||
      this.state.confirmPassword.length === 0 ||
      this.state.isSubmitting ||
      newPasswordState !== null ||
      confirmPasswordState !== null;

    return (
      <React.Fragment>
        {this.state.globalError && (
          <Errors
            errors={[this.state.globalError]}
            onDismiss={() => {
              this.setState({ globalError: "" });
            }}
          />
        )}
        <p>Enter your new password below.</p>
        <form method="POST" action="#">
          <FormGroup controlId="new-password" validationState={newPasswordState}>
            <ControlLabel>New password:</ControlLabel>
            <FormControl
              type="password"
              disabled={this.state.isSubmitting}
              onChange={this.handleChangeNewPassword}
              value={this.state.newPassword}
            />
            <HelpBlock>{this.state.newPasswordError}</HelpBlock>
          </FormGroup>

          <FormGroup controlId="confirm-password" validationState={confirmPasswordState}>
            <ControlLabel>Re-enter new password:</ControlLabel>
            <FormControl
              type="password"
              disabled={this.state.isSubmitting}
              onChange={this.handleChangeConfirmPassword}
              value={this.state.confirmPassword}
            />
            <HelpBlock>{this.state.confirmPasswordError}</HelpBlock>
          </FormGroup>

          <div className="form-footer">
            <PendingButton
              disabled={isSubmitButtonDisabled}
              pending={this.state.isSubmitting}
              onClick={this.handleSubmit}
              text="Reset Password"
              pendingText="Resetting..."
            />
          </div>
        </form>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="forgot-password-app-wrapper">
        <div className="reset-password-page">
          {this.state.didSubmit ? this.renderConfirmation() : this.renderForm()}
        </div>
      </div>
    );
  }
}
