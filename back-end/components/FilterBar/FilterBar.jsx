import React from "react";
import PropTypes from "prop-types";
import "./FilterBar.scss";

export default class FilterBar extends React.Component {
  render() {
    return (
      <div className="jk-filter filter input-group">
        <span className="input-group-addon" id="basic-addon1">
          <i className={`glyphicon glyphicon-${this.props.type}`} />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder={this.props.placeholder}
          aria-describedby="basic-addon1"
          onChange={this.props.onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}

FilterBar.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(["filter", "search"]),
  value: PropTypes.string
};

FilterBar.defaultProps = {
  placeholder: "Filter",
  onChange: () => {},
  type: "filter",
  value: ""
};
