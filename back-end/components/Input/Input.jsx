import React from "react";
import { bool, func, string } from "prop-types";

// Should this even be used? Bootstrap has one.  Or see how ResetPasswordPage uses FormGroup/FormControl and handles errors.

export default function Input(props) {
  const { disabled, name, label, onChange, type, value, ...rest } = props;
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        className="form-control"
        disabled={disabled}
        id={name}
        value={value}
        name={name}
        onChange={onChange}
        type={type}
        {...rest}
      />
    </div>
  );
}

Input.propTypes = {
  disabled: bool,
  label: string.isRequired,
  name: string.isRequired,
  onChange: func.isRequired,
  type: string,
  value: string.isRequired
};

Input.defaultProps = {
  disabled: false,
  type: "text"
};
