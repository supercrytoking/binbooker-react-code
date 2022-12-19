import React from "react";
import { post } from "Utils/services.jsx";
import Input from "Components/Input";
import PendingButton from "Components/PendingButton";
import "../ForgotPasswordApp.scss";

export default class ForgotPasswordPage extends React.Component {
  componentDidMount() {
    document.title = "Forgot Password";
  }

  state = {
    didSubmit: false,
    emailAddress: "",
    isSubmitting: false
  };

  handleSubmit = async () => {
    this.setState({ isSubmitting: true });

    await post("/api/v2/forgot-password", {
      email: this.state.emailAddress
    });

    this.setState({ didSubmit: true, emailAddress: "", isSubmitting: false });
  };

  renderConfirmation = () => {
    return (
      <React.Fragment>
        <h1>Sent!</h1>
        <p>If the supplied email address exists on this account, a link to reset the password has been sent.</p>
        <p>Emails usually arrive within a minute, but if it does not please make sure to check your "Junk" folder.</p>
      </React.Fragment>
    );
  };

  renderForm = () => {
    return (
      <React.Fragment>
        <p>
          <a href="/back/login">&larr; Back to login page</a>
        </p>
        <p>Enter your email address below and we will email you a link to reset your password.</p>
        <form method="POST" action="#">
          <Input
            label="Email:"
            name="email"
            disabled={this.state.isSubmitting}
            onChange={e => {
              this.setState({ emailAddress: e.target.value });
            }}
            value={this.state.emailAddress}
          />
          <div className="form-footer">
            <PendingButton
              disabled={this.state.isSubmitting}
              pending={this.state.isSubmitting}
              onClick={this.handleSubmit}
              text="Send link"
              pendingText="Sending link..."
            />
          </div>
        </form>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="forgot-password-app-wrapper">
        {this.state.didSubmit ? this.renderConfirmation() : this.renderForm()}
      </div>
    );
  }
}
