import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import Spinner from "../Spinner";
import "./PendingButton.scss";

export default class PendingButton extends React.Component {
  renderSpinner() {
    if (this.props.pending) {
      return <Spinner size="tiny" colour="white" />;
    }
    return null;
  }

  renderText() {
    return this.props.pending ? this.props.pendingText : this.props.text;
  }

  render() {
    return (
      <Button
        className="pending-button"
        bsStyle={this.props.bsStyle}
        disabled={this.props.disabled || this.props.pending}
        onClick={this.props.onClick}
      >
        {this.renderSpinner()}
        {this.renderText()}
      </Button>
    );
  }
}

PendingButton.propTypes = {
  disabled: PropTypes.bool,
  pending: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  pendingText: PropTypes.string,
  bsStyle: PropTypes.string
};

PendingButton.defaultProps = {
  disabled: false,
  pending: false,
  text: "Save",
  pendingText: "Saving...",
  bsStyle: "primary"
};
