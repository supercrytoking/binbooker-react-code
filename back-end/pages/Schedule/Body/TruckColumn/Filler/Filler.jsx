import React from "react";
import { func, number } from "prop-types";
import "./Filler.scss";

export default function Filler({ onDeleteFiller, orderTruckId }) {
  return (
    <div
      key={orderTruckId}
      data-id={orderTruckId}
      className="schedule-page__appointment schedule-page__appointment--filler"
    >
      <div className="title">
        <span className="glyphicon glyphicon-th" />
        Blocked
        <span className="glyphicon glyphicon-trash" onClick={onDeleteFiller} />
      </div>
    </div>
  );
}

Filler.propTypes = {
  onDeleteFiller: func.isRequired,
  orderTruckId: number.isRequired
};
