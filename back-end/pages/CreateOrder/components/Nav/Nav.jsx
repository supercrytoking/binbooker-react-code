import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./Nav.scss";

export const STEPS_ARRAY = ["code", "date", "service", "info", "review"];

export default class Nav extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleClickNavStep(name, complete) {
    if (complete) {
      this.props.onClickStep(name);
    }
  }

  renderNavStep(name) {
    const active = STEPS_ARRAY.indexOf(this.props.currentStep) === STEPS_ARRAY.indexOf(name.toLowerCase());
    const complete = STEPS_ARRAY.indexOf(this.props.currentStep) > STEPS_ARRAY.indexOf(name.toLowerCase());
    const disabled = STEPS_ARRAY.indexOf(this.props.currentStep) < STEPS_ARRAY.indexOf(name.toLowerCase());

    const stepClass = classnames(
      "col-xs-2 bs-wizard-step",
      { active: active },
      { complete: complete },
      { disabled: disabled }
    );

    return (
      <div className={stepClass}>
        <div className="text-center bs-wizard-stepnum">{name}</div>
        <div className="progress">
          <div className="progress-bar" />
        </div>
        <div
          className="bs-wizard-dot"
          onClick={() => {
            this.handleClickNavStep(name, complete);
          }}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="row bs-wizard">
        {this.renderNavStep(STEPS_ARRAY[0])}
        {this.renderNavStep(STEPS_ARRAY[1])}
        {this.renderNavStep(STEPS_ARRAY[2])}
        {this.renderNavStep(STEPS_ARRAY[3])}
        {this.renderNavStep(STEPS_ARRAY[4])}
      </div>
    );
  }
}

Nav.propTypes = {
  currentStep: PropTypes.oneOf(STEPS_ARRAY).isRequired,
  onClickStep: PropTypes.func.isRequired
};
