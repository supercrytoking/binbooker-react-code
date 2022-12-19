import React from "react";
import { func, number } from "prop-types";
import momentPropTypes from "react-moment-proptypes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { UserContext } from "../../../../../UserProvider.jsx";
import { getNumberOfSlotsOnActiveDay } from "../helper.js";
import "./AddFillerButton.scss";

function AddFillerButton({ numberOfSlotsFilled, onClick, totalNumberOfSlots }) {
  if (numberOfSlotsFilled >= totalNumberOfSlots) {
    return null;
  }

  const tooltip = (
    <Tooltip id="tooltip-what-is-filler">
      Create a Blocker to occupy an appointment slot in the truck's schedule (e.g. if the truck has scheduled
      maintenance, or the driver has the morning off).
    </Tooltip>
  );

  return (
    <OverlayTrigger delayShow={500} placement="top" overlay={tooltip}>
      <button className="add-filler-button btn btn-default" onClick={onClick}>
        Add Blocker
      </button>
    </OverlayTrigger>
  );
}

AddFillerButton.propTypes = {
  numberOfSlotsFilled: number,
  onClick: func,
  totalNumberOfSlots: number.isRequired
};

export default function AddFillerButtonWithContext({ date, numberOfSlotsFilled, onClick }) {
  return (
    <UserContext.Consumer>
      {user => {
        if (!user) {
          return null; // Still loading user
        }

        return (
          <AddFillerButton
            onClick={onClick}
            numberOfSlotsFilled={numberOfSlotsFilled}
            totalNumberOfSlots={getNumberOfSlotsOnActiveDay(user, date.format("dddd"))}
          />
        );
      }}
    </UserContext.Consumer>
  );
}

AddFillerButtonWithContext.propTypes = {
  date: momentPropTypes.momentObj.isRequired,
  numberOfSlotsFilled: number.isRequired,
  onClick: func.isRequired
};
