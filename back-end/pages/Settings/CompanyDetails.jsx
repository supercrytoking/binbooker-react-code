import React, { Component } from "react";
import { Form, FormGroup, FormControl, Row, Col } from "react-bootstrap";
import { provinces, states } from "Utils/library.jsx";

class CompanyDetails extends Component {
  renderProvinces() {
    const provincesHtml = [];
    const provincesOrStates = this.props.currency === "CAD" ? provinces : states;
    provincesHtml.push(
      <option value="" key="select">
        - Select -
      </option>
    );
    provincesHtml.push(
      provincesOrStates.map(provinceOrState => (
        <option value={provinceOrState.value} key={provinceOrState.value}>
          {provinceOrState.text}
        </option>
      ))
    );
    return provincesHtml;
  }

  render() {
    const { settings, currency, handleChange, isSaving } = this.props;
    const disabled = isSaving ? "disabled" : null;

    return (
      <React.Fragment>
        <p className="description">
          The information below is publicly visible. It appears during the online ordering process, and/or on invoices
          and receipts.
        </p>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup controlId="companyName">
            <Row>
              <Col sm={2}>
                <label htmlFor="companyName">Company name*</label>
              </Col>
              <Col sm={6}>
                <FormControl
                  disabled={disabled}
                  type="text"
                  value={settings.companyName}
                  onChange={e => {
                    handleChange(e.target.value, "companyName");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="address1">
            <Row>
              <Col sm={2}>
                <label htmlFor="address1">Address 1*</label>
              </Col>
              <Col sm={6}>
                <FormControl
                  disabled={disabled}
                  type="text"
                  value={settings.address1}
                  onChange={e => {
                    handleChange(e.target.value, "address1");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="address2">
            <Row>
              <Col sm={2}>
                <label htmlFor="address2">Address 2</label>
              </Col>
              <Col sm={6}>
                <FormControl
                  disabled={disabled}
                  type="text"
                  value={settings.address2}
                  onChange={e => {
                    handleChange(e.target.value, "address2");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="city">
            <Row>
              <Col sm={2}>
                <label htmlFor="city">City*</label>
              </Col>
              <Col sm={6}>
                <FormControl
                  disabled={disabled}
                  type="text"
                  value={settings.city}
                  onChange={e => {
                    handleChange(e.target.value, "city");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="province">
            <Row>
              <Col sm={2}>
                <label htmlFor="province">{currency === "CAD" ? "Province*" : "State*"}</label>
              </Col>
              <Col sm={6}>
                <select
                  disabled={disabled}
                  className="form-control"
                  id="provinceSelect"
                  value={settings.province}
                  onChange={e => {
                    handleChange(e.target.value, "province");
                  }}
                >
                  {this.renderProvinces()}
                </select>
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="postalCode">
            <Row>
              <Col sm={2}>
                <label htmlFor="postalCode">{currency === "CAD" ? "Postal code*" : "Zip code*"}</label>
              </Col>
              <Col sm={3}>
                <FormControl
                  disabled={disabled}
                  type="text"
                  value={settings.postalCode}
                  onChange={e => {
                    handleChange(e.target.value, "postalCode");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="phone">
            <Row>
              <Col sm={2}>
                <label htmlFor="phone">Phone number*</label>
              </Col>
              <Col sm={3}>
                <FormControl
                  disabled={disabled}
                  type="text"
                  value={settings.phoneNumber}
                  onChange={e => {
                    handleChange(e.target.value, "phoneNumber");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="url">
            <Row>
              <Col sm={2}>
                <label htmlFor="url">Url*</label>
              </Col>
              <Col sm={6}>
                <FormControl
                  disabled={disabled}
                  type="text"
                  value={settings.url}
                  onChange={e => {
                    handleChange(e.target.value, "url");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="email">
            <Row>
              <Col sm={2}>
                <label htmlFor="email">Email*</label>
              </Col>
              <Col sm={6}>
                <FormControl
                  disabled={disabled}
                  type="email"
                  value={settings.email}
                  onChange={e => {
                    handleChange(e.target.value, "email");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>
        </Form>
      </React.Fragment>
    );
  }
}

export default CompanyDetails;
