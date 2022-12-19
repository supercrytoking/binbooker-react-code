import React from "react";
import PropTypes from "prop-types";

// Should this use the Bootstrap component? https://5c507d49471426000887a6a7--react-bootstrap.netlify.app/components/dropdowns/
// That'd break a lot of tests

export default function Select({ name, label, value, options, onChange, disabled }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        className="form-control"
        defaultValue={value}
        disabled={disabled}
        name={name}
        id={name}
        onChange={onChange}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired, //e.g. [{value: '', text: ''}, {value: '', text: ''}, ...]
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

Select.defaultProps = {
  disabled: false
};
