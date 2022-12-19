import React from "react";
import { storiesOf } from "@storybook/react";
import ForgotPasswordPage from "./ForgotPasswordPage/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./ResetPasswordPage/ResetPasswordPage.jsx";
import "./ForgotPasswordApp.scss";

const props = {
  isDemoAccount: false,
  onSubmit: () => {
    alert("Clicked submit.");
  }
};

storiesOf("Login", module)
  .add("ForgotPasswordPage", () => (
    <div className="forgot-password-app-wrapper">
      <main>
        <ForgotPasswordPage />
      </main>
    </div>
  ))
  .add("ResetPasswordPage", () => (
    <div className="forgot-password-app-wrapper">
      <main>
        <ResetPasswordPage />
      </main>
    </div>
  ));
