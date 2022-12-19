import React from "react";
import PropTypes from "prop-types";

export default class ClickOutside extends React.Component {
  constructor(props) {
    super(props);
    this.component = null;
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
  }

  handleClickOutside(e) {
    if (!this.component.contains(e.target)) {
      this.props.onClickHandler();
    }
  }

  render() {
    return (
      <div
        ref={component => {
          this.component = component;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

ClickOutside.propTypes = {
  onClickHandler: PropTypes.func,
  children: PropTypes.node
};

ClickOutside.defaultProps = {
  onClickHandler: () => {}
};
