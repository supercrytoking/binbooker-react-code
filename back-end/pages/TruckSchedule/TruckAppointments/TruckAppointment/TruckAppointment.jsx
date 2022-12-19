import React from "react";
import { bool, func, string } from "prop-types";
import classnames from "classnames";
import "./TruckAppointment.scss";

export default class TruckAppointment extends React.Component {
  static propTypes = {
    orderId: string,
    binForeignId: string,
    title: string,
    type: string.isRequired,
    orderNotes: string,
    companyName: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    customerNotes: string,
    deliveryCity: string,
    deliveryPostalCode: string,
    deliveryProvince: string,
    deliveryStreet1: string,
    endDateTime: string,
    startDateTime: string,
    isComplete: bool.isRequired,
    onToggleAppointment: func.isRequired,
    canToggleAppointments: bool.isRequired,
    onSetActiveOrder: func
  };

  //this was copied from Schedule/index.jsx
  renderNotes(str) {
    if (str.length > 0) {
      return <div className="notes">Notes: {str}</div>;
    }
    return null;
  }

  renderAddress() {
    const addressString = `${this.props.deliveryStreet1} ${this.props.deliveryCity} ${this.props.deliveryProvince} ${this.props.deliveryPostalCode}`;
    const googleUrl = `https://www.google.com/maps/place/${encodeURIComponent(addressString)}`;

    return (
      <div className="address">
        <a href={googleUrl} target="_blank" rel="noopener noreferrer">
          {this.props.deliveryStreet1}, {this.props.deliveryCity}
        </a>
      </div>
    );
  }

  renderBody() {
    if (this.props.type === "f") {
      return <div className="details">Blocked</div>;
    }

    const types = { p: "Pick-up", d: "Drop-off" };
    const displayName = this.props.companyName
      ? `${this.props.companyName} (${this.props.firstName} ${this.props.lastName})`
      : `${this.props.firstName} ${this.props.lastName}`;

    return (
      <React.Fragment>
        <div className="details">
          {types[this.props.type]} {this.props.title} ({this.props.binForeignId})
        </div>
        {this.renderAddress()}
        <div className="order-number">Order #{this.props.orderId}</div>
        {this.renderNotes(this.props.orderNotes)}
        <div className="customer-name">{displayName}</div>
        <a className="phone" href={`tel:${this.props.phone}`}>
          {this.props.phone}
        </a>
        {this.renderNotes(this.props.customerNotes)}
      </React.Fragment>
    );
  }

  renderStatusCircle() {
    if (!this.props.canToggleAppointments) {
      return null;
    }

    return (
      <div className="status-circle" onClick={this.props.onToggleAppointment}>
        <div className="status-circle__inner">
          <div className="glyphicon glyphicon-ok" />
        </div>
      </div>
    );
  }

  renderSidePanelTrigger() {
    if (!this.props.canToggleAppointments) {
      return null;
    }

    return (
      <a
        href="#"
        tabIndex="0"
        className="truck-appointment__sidepanel-trigger btn btn-default"
        onClick={() => {
          this.props.onSetActiveOrder();
          return false;
        }}
      >
        <span className="glyphicon glyphicon-option-horizontal" />
      </a>
    );
  }

  render() {
    const cn = classnames(
      "truck-appointment",
      { "truck-appointment--filler": this.props.type === "f" },
      { "truck-appointment--completed": this.props.isComplete }
    );

    return (
      <div className={cn}>
        {this.renderStatusCircle()}
        {this.renderSidePanelTrigger()}
        {this.renderBody()}
      </div>
    );
  }
}
