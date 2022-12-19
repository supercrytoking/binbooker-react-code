import React, { Component } from "react";
import { Form, FormGroup, Row, Col, Glyphicon, OverlayTrigger, Tooltip } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Content.scss";

const modules = {
  toolbar: [{ list: "bullet" }, "bold", "italic", "underline"]
};

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        cityText: "",
        dateText: "",
        serviceText: "",
        infoText: "",
        reviewText: "",
        confirmationText: "",
        termsAndConditions: ""
      }
    };
  }

  componentDidMount() {
    this.setState({ settings: this.props.settings });
  }

  overrideHandleChange = (value, id) => {
    if (value === "<p><br></p>") {
      this.props.handleChange("", id);
    } else {
      this.props.handleChange(value, id);
    }
  };

  renderFormGroup = (id, label, initialValue) => (
    <FormGroup controlId={id}>
      <Row>
        <Col sm={2}>
          <label htmlFor={id}>{label}</label>
        </Col>
        <Col sm={10}>
          <ReactQuill
            readOnly={this.props.isSaving}
            modules={modules}
            value={initialValue}
            onChange={value => {
              this.overrideHandleChange(value, id);
            }}
          />
        </Col>
      </Row>
    </FormGroup>
  );

  render() {
    const { settings } = this.state;
    const { currency } = this.props;

    const codePageTitle = currency === "CAD" ? "Postal code page" : "Zip code page";

    const tooltip = (
      <Tooltip id="tooltip-terms-and-conditions">
        Optionally enter your Terms and Conditions that the customer must agree to before they can place an order
        online.
      </Tooltip>
    );

    return (
      <div className="settings-page__content-tab">
        <p className="description">
          The content below appears on the corresponding step of the online booking process.
        </p>
        <Form onSubmit={this.handleSubmit}>
          {this.renderFormGroup("cityText", codePageTitle, settings.cityText)}
          {this.renderFormGroup("dateText", "Date page", settings.dateText)}
          {this.renderFormGroup("serviceText", "Service page", settings.serviceText)}
          {this.renderFormGroup("infoText", "Info page", settings.infoText)}
          {this.renderFormGroup("reviewText", "Payment page", settings.reviewText)}
          {this.renderFormGroup("confirmationText", "Confirmation page", settings.confirmationText)}

          <FormGroup controlId="termsAndConditions">
            <Row>
              <Col sm={2}>
                <label htmlFor="termsAndConditions">
                  Terms And Conditions
                  <OverlayTrigger delayShow={500} placement="top" overlay={tooltip}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </label>
              </Col>
              <Col sm={10}>
                <ReactQuill
                  readOnly={this.props.isSaving}
                  modules={modules}
                  value={settings.termsAndConditions}
                  onChange={value => {
                    this.overrideHandleChange(value, "termsAndConditions");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default Content;
