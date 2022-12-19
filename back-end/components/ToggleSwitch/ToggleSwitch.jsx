/*
  Toggle Switch Component from https://github.com/praveenscience/ToggleSwitch
  Note: id is required for ToggleSwitch component to function. name, currentValue, isChecked, isSmall and onChange are optional.
  Usage: <ToggleSwitch id="id" onChange={function (e) { console.log("Checkbox Current State: " + e.target.checked); }} />
*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import "./ToggleSwitch.scss";

class ToggleSwitch extends Component {
  render() {
    return (
      <div
        className={
          "toggle-switch" +
          (this.props.isSmall ? " isSmall-switch" : "") +
          (this.props.isDisabled ? " toggle-switch-disabled" : "")
        }
      >
        <input
          type="checkbox"
          name={this.props.name}
          className="toggle-switch-checkbox"
          id={this.props.id}
          checked={this.props.isChecked}
          onChange={() => {
            this.props.onChange();
          }}
          disabled={this.props.isDisabled}
        />
        <label className="toggle-switch-label" htmlFor={this.props.id}>
          <span
            className={this.props.isDisabled ? "toggle-switch-inner toggle-switch-disabled" : "toggle-switch-inner"}
            data-yes="On"
            data-no="Off"
          />
          <span
            className={this.props.isDisabled ? "toggle-switch-switch toggle-switch-disabled" : "toggle-switch-switch"}
          />
        </label>
      </div>
    );
  }
}

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isChecked: PropTypes.bool,
  isSmall: PropTypes.bool,
  isDisabled: PropTypes.bool
};

export default ToggleSwitch;
