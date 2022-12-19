import React from "react";
import { Form, FormGroup, FormControl, Row, Col, Glyphicon, OverlayTrigger, Tooltip } from "react-bootstrap";

export default function Billing({ settings, handleChange, isSaving }) {
  const disabled = isSaving ? "disabled" : null;

  function renderStripeFields() {
    if (settings.useTestStripe) {
      return (
        <React.Fragment>
          <FormGroup controlId="stripeSecretKeyTest">
            <Row>
              <Col sm={3}>
                <label htmlFor="stripeSecretKeyTest">Test Stripe secret key*</label>
              </Col>
              <Col sm={6}>
                <FormControl
                  disabled={disabled}
                  type="text"
                  value={settings.stripeSecretKeyTest}
                  onChange={e => {
                    handleChange(e.target.value, "stripeSecretKeyTest");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup controlId="stripePublishableKeyTest">
            <Row>
              <Col sm={3}>
                <label htmlFor="stripePublishableKeyTest">Test Stripe publishable key*</label>
              </Col>
              <Col sm={6}>
                <FormControl
                  disabled={disabled}
                  type="text"
                  value={settings.stripePublishableKeyTest}
                  onChange={e => {
                    handleChange(e.target.value, "stripePublishableKeyTest");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <FormGroup controlId="stripeSecretKeyLive">
          <Row>
            <Col sm={3}>
              <label htmlFor="stripeSecretKeyLive">Live Stripe secret key*</label>
            </Col>
            <Col sm={6}>
              <FormControl
                disabled={disabled}
                type="text"
                value={settings.stripeSecretKeyLive}
                onChange={e => {
                  handleChange(e.target.value, "stripeSecretKeyLive");
                }}
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup controlId="stripePublishableKeyLive">
          <Row>
            <Col sm={3}>
              <label htmlFor="stripePublishableKeyLive">Live Stripe publishable key*</label>
            </Col>
            <Col sm={6}>
              <FormControl
                disabled={disabled}
                type="text"
                value={settings.stripePublishableKeyLive}
                onChange={e => {
                  handleChange(e.target.value, "stripePublishableKeyLive");
                }}
              />
            </Col>
          </Row>
        </FormGroup>
      </React.Fragment>
    );
  }

  const taxRegistrationTooltip = (
    <Tooltip id="tooltip-tax-registration">
      When provided this information will appear on receipts and invoices.
    </Tooltip>
  );

  const testStripeTooltip = (
    <Tooltip id="tooltip-test-stripe">
      Use "Live" to charge actual credit card numbers and "Test" when you want to create test orders with the fake
      credit card "4242&nbsp;4242&nbsp;4242&nbsp;4242".
      <br />
      <br />
      Note that if a customer is created in "Test" mode, they will not be able to place an order when you switch to
      "Live" mode.
    </Tooltip>
  );

  return (
    <React.Fragment>
      <Form>
        <FormGroup controlId="currency">
          <Row>
            <Col sm={3}>
              <label htmlFor="currency">Currency*</label>
            </Col>
            <Col sm={2}>
              <select
                className="form-control"
                disabled={disabled}
                id="currencySelect"
                value={settings.currency}
                onChange={e => {
                  handleChange(e.target.value, "currency");
                }}
              >
                <option>USD</option>
                <option>CAD</option>
              </select>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup controlId="tax1">
          <Row>
            <Col sm={3}>
              <label>Tax1</label>
            </Col>
            <Col sm={6}>
              <Row>
                <Col sm={6}>
                  Name:
                  <FormControl
                    disabled={disabled}
                    type="text"
                    value={settings.tax1Name}
                    onChange={e => {
                      handleChange(e.target.value, "tax1Name");
                    }}
                  />
                </Col>
                <Col sm={6}>
                  Rate:
                  <FormControl
                    disabled={disabled}
                    type="number"
                    step="0.01"
                    value={settings.tax1}
                    onChange={e => {
                      handleChange(e.target.value, "tax1");
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup controlId="tax2Name">
          <Row>
            <Col sm={3}>
              <label htmlFor="tax2Name">Tax2</label>
            </Col>
            <Col sm={6}>
              <Row>
                <Col sm={6}>
                  Name:
                  <FormControl
                    disabled={disabled}
                    type="text"
                    value={settings.tax2Name}
                    onChange={e => {
                      handleChange(e.target.value, "tax2Name");
                    }}
                  />
                </Col>
                <Col sm={6}>
                  Rate:
                  <FormControl
                    disabled={disabled}
                    type="number"
                    step="0.01"
                    value={settings.tax2}
                    onChange={e => {
                      handleChange(e.target.value, "tax2");
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup controlId="taxRegistrationTitle">
          <Row>
            <Col sm={3}>
              <label htmlFor="taxRegistrationTitle">
                Tax registration
                <OverlayTrigger delayShow={500} placement="top" overlay={taxRegistrationTooltip}>
                  <Glyphicon glyph="question-sign" />
                </OverlayTrigger>
              </label>
            </Col>
            <Col sm={6}>
              <Row>
                <Col sm={6}>
                  Title:
                  <FormControl
                    disabled={disabled}
                    type="text"
                    value={settings.taxRegistrationTitle}
                    onChange={e => {
                      handleChange(e.target.value, "taxRegistrationTitle");
                    }}
                  />
                </Col>
                <Col sm={6}>
                  Value:
                  <FormControl
                    disabled={disabled}
                    type="text"
                    value={settings.taxRegistrationValue}
                    onChange={e => {
                      handleChange(e.target.value, "taxRegistrationValue");
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup controlId="useTestStripe">
          <Row>
            <Col sm={3}>
              <label htmlFor="useTestStripe">
                Use live or test Stripe account?
                <OverlayTrigger delayShow={500} placement="top" overlay={testStripeTooltip}>
                  <Glyphicon glyph="question-sign" />
                </OverlayTrigger>
              </label>
            </Col>
            <Col sm={6}>
              <select
                className="form-control"
                disabled={disabled}
                id="useTestStripe"
                value={settings.useTestStripe ? "true" : "false"}
                onChange={e => {
                  handleChange(e.target.value === "true", "useTestStripe");
                }}
              >
                <option value="false">Live</option>
                <option value="true">Test</option>
              </select>
            </Col>
          </Row>
        </FormGroup>

        {renderStripeFields()}
      </Form>
    </React.Fragment>
  );
}
