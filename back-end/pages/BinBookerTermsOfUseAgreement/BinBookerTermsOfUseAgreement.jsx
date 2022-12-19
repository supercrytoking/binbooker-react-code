import React from "react";
import PropTypes from "prop-types";
import { Alert, Well } from "react-bootstrap";
import PendingButton from "Components/PendingButton";
import { post } from "Utils/services.jsx";
import { UserContext } from "../../UserProvider.jsx";
import "./BinBookerTermsOfUseAgreement.scss";

export default function BinBookerTermsOfUseAgreement({ children }) {
  const [agreed, setAgreed] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const user = React.useContext(UserContext);

  if (user.agreedToTermsDate) {
    return children;
  }

  return (
    <div className="terms-of-use">
      <Well>
        <h1>Thank you for choosing BinBooker!</h1>
        <p>
          Before you can begin using the app you must read and agree to our&nbsp;
          <a href="http://binbooker.com/terms-of-use.html" target="_blank" rel="noopener noreferrer">
            Terms of Use.
          </a>
        </p>
        <p>
          <label>
            <input
              type="checkbox"
              checked={agreed}
              disabled={isLoading}
              onChange={() => {
                setAgreed(agreed => !agreed);
                setError("");
              }}
            />{" "}
            I have read and agree to BinBooker.com's Terms of Use.
          </label>
          {error && <Alert bsStyle="danger">{error}</Alert>}
        </p>
        <PendingButton
          bsStyle="primary"
          pending={isLoading}
          onClick={async () => {
            if (agreed) {
              setIsLoading(true);
              setError("");

              try {
                await post("/api/v2/user-agreed-to-terms");
                window.location.reload();
                return;
              } catch (e) {
                setError(
                  "An error occurred on the server, please try again. If this continues please contact us directly."
                );
              }
            } else {
              setError(
                "You must click the checkbox above indicating you have read and agree to BinBooker.com's Terms of Use before continuing."
              );
            }
            setIsLoading(false);
          }}
          text="Continue"
          pendingText="Processing..."
        />
      </Well>
    </div>
  );
}

BinBookerTermsOfUseAgreement.propTypes = {
  children: PropTypes.node.isRequired
};

BinBookerTermsOfUseAgreement.defaultProps = {};
