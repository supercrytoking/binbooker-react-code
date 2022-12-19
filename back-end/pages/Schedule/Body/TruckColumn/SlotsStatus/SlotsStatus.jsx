import React from "react";
import { number, string } from "prop-types";
import classnames from "classnames";
import momentPropTypes from "react-moment-proptypes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { UserContext } from "../../../../../UserProvider.jsx";
import { getNumberOfSlotsOnActiveDay } from "../helper.js";
import "./SlotsStatus.scss";

function SlotsStatus({ className, numberOfSlotsFilled, totalNumberOfSlots }) {
  const cn = classnames("slots-status", className, {
    "slots-status--overfilled": numberOfSlotsFilled > totalNumberOfSlots
  });

  const tooltip = (
    <Tooltip id="tooltip-truck-slots-filled">
      Your daily maximum is {totalNumberOfSlots} appointments per truck, and currently you have {numberOfSlotsFilled}{" "}
      scheduled.
    </Tooltip>
  );

  return (
    <OverlayTrigger delayShow={500} placement="top" overlay={tooltip}>
      <span className={cn}>
        ({numberOfSlotsFilled}/{totalNumberOfSlots})
      </span>
    </OverlayTrigger>
  );
}

SlotsStatus.propTypes = {
  className: string,
  numberOfSlotsFilled: number,
  totalNumberOfSlots: number
};

export default function SlotsStatusWithContext({ className, date, numberOfSlotsFilled }) {
  return (
    <UserContext.Consumer>
      {user => {
        if (!user) {
          return null; // Still loading user
        }

        return (
          <SlotsStatus
            className={className}
            numberOfSlotsFilled={numberOfSlotsFilled}
            totalNumberOfSlots={getNumberOfSlotsOnActiveDay(user, date.format("dddd"))}
          />
        );
      }}
    </UserContext.Consumer>
  );
}

SlotsStatusWithContext.propTypes = {
  className: string,
  date: momentPropTypes.momentObj.isRequired,
  numberOfSlotsFilled: number.isRequired
};

SlotsStatusWithContext.defaultProps = {
  className: ""
};
