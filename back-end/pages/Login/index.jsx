import React, { useState } from "react";
import { Form, FormGroup, FormControl, Alert, ControlLabel } from "react-bootstrap";
import { post } from "Utils/services.jsx";
import PendingButton from "Components/PendingButton";
import "./LoginApp.scss";
// import "bootstrap/dist/css/bootstrap.min.css";

// TODO: if the browser autofills the inputs, the submit button is disabled. It becomes enable when you click anywhere (even clicking on the 'submit' button will submit).
// I tried to fix it by moving focus, and updating state using refs, but no luck.
// I could make the 'Login' button always enabled, and show an error when they leave a field blank?

export function LoginApp({ isDemoAccount }) {
  const [formFields, setFormFields] = useState({
    username: {
      value: isDemoAccount ? "admin@sampledisposal.com" : "",
      isValid: isDemoAccount
    },
    password: {
      value: isDemoAccount ? "demo" : "",
      isValid: isDemoAccount
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    document.title = "Login";
  }, []);

  const updateFieldValue = (fieldName, value) => {
    const _formFields = { ...formFields };
    _formFields[fieldName].value = value;
    _formFields[fieldName].isValid = value.length > 0;
    setFormFields(_formFields);
  };

  async function handleClickLogin() {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await post("/api/v2/login", {
        username: formFields.username.value,
        password: formFields.password.value
      });
      window.location = `/back/${response.urlAfterLogin}`;
    } catch (errorMessage) {
      setError("Login failed; please check your email and password and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-app-wrapper">
      {error && (
        <Alert bsStyle="danger" className="login-app-wrapper__error">
          {error}
        </Alert>
      )}
      <Form className="login-app-wrapper__form">
        <FormGroup controlId="username">
          <ControlLabel>Email:</ControlLabel>
          <FormControl
            disabled={isSubmitting}
            type="text"
            value={formFields.username.value}
            onChange={e => updateFieldValue("username", e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="password">
          <ControlLabel>Password:</ControlLabel>
          <FormControl
            disabled={isSubmitting}
            type="password"
            value={formFields.password.value}
            onChange={e => updateFieldValue("password", e.target.value)}
          />
        </FormGroup>

        <div className="login-app-wrapper__actions">
          <PendingButton
            disabled={!formFields.username.isValid || !formFields.password.isValid}
            pending={isSubmitting}
            onClick={handleClickLogin}
            text="Login"
            pendingText="Logging in..."
          />
          <a href="forgot-password">Forgot password</a>
        </div>
      </Form>
    </div>
  );
}

export default function LoginAppWrapper() {
  const isDemoAccount = window.location.host.indexOf("sample.") === 0;

  return <LoginApp isDemoAccount={isDemoAccount} />;
}
