import React from "react";
import PropTypes from "prop-types";

export default class Textarea extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <textarea
          className="form-control"
          disabled={this.props.disabled}
          rows={this.props.rows}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  rows: PropTypes.number
};

Textarea.defaultProps = {
  disabled: false,
  rows: 3
};
