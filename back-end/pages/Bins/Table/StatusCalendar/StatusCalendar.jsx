import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { UserContext } from "../../../../UserProvider";
import { BinsContext } from "../../BinsContainer";
import { pad } from "Utils/library";
import "./StatusCalendar.scss";

// TODO: tests? could just be a jest snapshot

export default function StatusCalendar({ binId, binIsActive, numberOfDaysToShow, orders }) {
  const user = React.useContext(UserContext);
  const bins = React.useContext(BinsContext);
  const { holidays } = bins;

  function dateIsBetweenStartAndEndDates(dateString) {
    // if this date is between the start and end date of an appointment
    return orders.find(order => {
      const { startDateTime, endDateTime } = order;
      const startDate = startDateTime.substring(0, 10);
      const endDate = endDateTime.substring(0, 10);
      return dateString > startDate && dateString < endDate;
    });
  }

  function dateIsOnStartDateAndEndDate(dateString) {
    return dateIsOnStartDate(dateString) && dateIsOnEndDate(dateString);
  }

  function dateIsOnStartDate(dateString) {
    // if this date is between the start and end date of an appointment
    return orders.find(order => {
      const { startDateTime } = order;
      const startDate = startDateTime.substring(0, 10);
      return dateString === startDate;
    });
  }

  function dateIsOnEndDate(dateString) {
    // if this date is between the start and end date of an appointment
    return orders.find(order => {
      const { endDateTime } = order;
      const endDate = endDateTime.substring(0, 10);
      return dateString === endDate;
    });
  }

  function dateIsOnWeekend(d) {
    return d.getDay() === 0 || d.getDay() === 6;
  }

  function dateIsClosed(d, dateString) {
    if (!binIsActive) {
      return true;
    }

    if (
      (user.maxJobsMonday == 0 && d.getDay() === 1) ||
      (user.maxJobsTuesday == 0 && d.getDay() === 2) ||
      (user.maxJobsWednesday == 0 && d.getDay() === 3) ||
      (user.maxJobsThursday == 0 && d.getDay() === 4) ||
      (user.maxJobsFriday == 0 && d.getDay() === 5) ||
      (user.maxJobsSaturday == 0 && d.getDay() === 6) ||
      (user.maxJobsSunday == 0 && d.getDay() === 0)
    ) {
      return true;
    }

    if (holidays.find(holiday => holiday === dateString)) {
      return true;
    }

    return false;
  }

  function dateIsSingleDayOrder(dateString) {
    return orders.find(order => {
      const { startDateTime, endDateTime } = order;
      const startDate = startDateTime.substring(0, 10);
      const endDate = endDateTime.substring(0, 10);
      return dateString === endDate && dateString === startDate;
    });
  }

  function getOrderIdsOnThisDate(dateString) {
    return orders
      .filter(order => {
        const { startDateTime, endDateTime } = order;
        const startDate = startDateTime.substring(0, 10);
        const endDate = endDateTime.substring(0, 10);

        return (dateString > startDate && dateString < endDate) || dateString === startDate || dateString === endDate;
      })
      .map(order => order.orderId);
  }

  function getTooltipTextOnDate(orderIds) {
    return orderIds.length === 2 ? `Order #${orderIds[0]} / Order #${orderIds[1]}` : `Order #${orderIds[0]}`;
  }

  const output = [];
  for (let i = 0; i < numberOfDaysToShow; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateString = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const shouldSplitCell = dateIsOnStartDateAndEndDate(dateString) && !dateIsSingleDayOrder(dateString);

    const cn = classnames(
      "status-calendar__day",
      { "status--full-day": dateIsBetweenStartAndEndDates(dateString) || dateIsSingleDayOrder(dateString) },
      { "status--drop-off": dateIsOnStartDate(dateString) && !dateIsSingleDayOrder(dateString) },
      { "status--pick-up": dateIsOnEndDate(dateString) && !dateIsSingleDayOrder(dateString) },
      { "status--drop-off-and-pick-up": shouldSplitCell },
      { "status--weekend": dateIsOnWeekend(d) },
      { "status--closed": dateIsClosed(d, dateString) }
    );

    const contents = (
      <div className={cn} key={`${binId}-${i}`}>
        {shouldSplitCell && <div className="status-calendar__divider"></div>}
        <div className="status-calendar__content">{d.getDate()}</div>
      </div>
    );

    const orderIdsOnThisDate = getOrderIdsOnThisDate(dateString);
    const OrderTooltip = orderIdsOnThisDate.length ? (
      <Tooltip id="tooltip">{getTooltipTextOnDate(orderIdsOnThisDate)}</Tooltip>
    ) : null;

    if (orderIdsOnThisDate.length) {
      output.push(
        <OverlayTrigger placement="top" overlay={OrderTooltip} key={`overlay-${binId}-${i}`}>
          {contents}
        </OverlayTrigger>
      );
    } else {
      output.push(contents);
    }
  }

  return <div className="status-calendar">{output}</div>;
}

StatusCalendar.propTypes = {
  binId: PropTypes.string.isRequired,
  binIsActive: PropTypes.bool.isRequired,
  orders: PropTypes.array
};

StatusCalendar.defaultProps = {
  orders: []
};
