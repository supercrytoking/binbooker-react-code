import React, { Component } from "react";
import { Form, FormGroup, FormControl, Row, Col } from "react-bootstrap";

class Scheduling extends Component {
  render() {
    const { settings, handleChange, isSaving } = this.props;
    const disabled = isSaving ? "disabled" : null;

    return (
      <React.Fragment>
        <p className="description">
          The maximum number of appointments (drop-offs/pick-ups) that a single truck can complete on the specified day
          of the week. Once this number is reached for a date for all of your trucks, customers will not be able to
          select that date when ordering online (but you will still be able to when creating an order from the
          back-end). Enter "0" if you do not operate on that day of the week.
        </p>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup controlId="maxJobsMonday">
            <Row>
              <Col sm={3}>
                <label htmlFor="maxJobsMonday">Maximum jobs Monday*</label>
              </Col>
              <Col sm={2}>
                <FormControl
                  disabled={disabled}
                  type="number"
                  value={settings.maxJobsMonday}
                  onChange={e => {
                    handleChange(e.target.value, "maxJobsMonday");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="maxJobsTuesday">
            <Row>
              <Col sm={3}>
                <label htmlFor="maxJobsTuesday">Maximum jobs Tuesday*</label>
              </Col>
              <Col sm={2}>
                <FormControl
                  disabled={disabled}
                  type="number"
                  value={settings.maxJobsTuesday}
                  onChange={e => {
                    handleChange(e.target.value, "maxJobsTuesday");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="maxJobsWednesday">
            <Row>
              <Col sm={3}>
                <label htmlFor="maxJobsWednesday">Maximum jobs Wednesday*</label>
              </Col>
              <Col sm={2}>
                <FormControl
                  disabled={disabled}
                  type="number"
                  value={settings.maxJobsWednesday}
                  onChange={e => {
                    handleChange(e.target.value, "maxJobsWednesday");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="maxJobsThursday">
            <Row>
              <Col sm={3}>
                <label htmlFor="maxJobsThursday">Maximum jobs Thursday*</label>
              </Col>
              <Col sm={2}>
                <FormControl
                  disabled={disabled}
                  type="number"
                  value={settings.maxJobsThursday}
                  onChange={e => {
                    handleChange(e.target.value, "maxJobsThursday");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="maxJobsFriday">
            <Row>
              <Col sm={3}>
                <label htmlFor="maxJobsFriday">Maximum jobs Friday*</label>
              </Col>
              <Col sm={2}>
                <FormControl
                  disabled={disabled}
                  type="number"
                  value={settings.maxJobsFriday}
                  onChange={e => {
                    handleChange(e.target.value, "maxJobsFriday");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="maxJobsSaturday">
            <Row>
              <Col sm={3}>
                <label htmlFor="maxJobsSaturday">Maximum jobs Saturday*</label>
              </Col>
              <Col sm={2}>
                <FormControl
                  disabled={disabled}
                  type="number"
                  value={settings.maxJobsSaturday}
                  onChange={e => {
                    handleChange(e.target.value, "maxJobsSaturday");
                  }}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="maxJobsSunday">
            <Row>
              <Col sm={3}>
                <label htmlFor="maxJobsSunday">Maximum jobs Sunday*</label>
              </Col>
              <Col sm={2}>
                <FormControl
                  disabled={disabled}
                  type="number"
                  value={settings.maxJobsSunday}
                  onChange={e => {
                    handleChange(e.target.value, "maxJobsSunday");
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

export default Scheduling;
