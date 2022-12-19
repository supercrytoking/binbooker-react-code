import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import SingleDatePickerRow from "Components/SingleDatePickerRow";
import PendingButton from "Components/PendingButton";
import Spinner from "Components/Spinner";
import { NO_PICKUP_DATE } from "Utils/constants.jsx";
import { get, put } from "Utils/services.jsx";
import { OrdersContext } from "../../../OrdersContext";
import { getClosedDaysOfWeek } from "./utils";

export function Dates(props) {
  const { orders, setOrders } = React.useContext(props.context);

  const [dropOff, setDropOff] = React.useState(moment(props.dropOff).format("YYYY-MM-DD"));
  const [dropOffDateFocus, setDropOffDateFocus] = React.useState(false);
  const [showDropOffDateWarning, setShowDropOffDateWarning] = React.useState(false);

  const [pickUp, setPickUp] = React.useState(moment(props.pickUp).format("YYYY-MM-DD"));
  const [pickUpDateFocus, setPickUpDateFocus] = React.useState(false);
  const [showPickUpDateWarning, setShowPickUpDateWarning] = React.useState(false);

  const [holidays, setHolidays] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  const closedDaysOfWeek = getClosedDaysOfWeek(props.user);

  React.useEffect(() => {
    async function fetchAndSetHolidays() {
      const data = await get("/api/v2/holidays");
      const holidays = data.map(holiday => holiday.date);
      setHolidays(holidays);
    }

    fetchAndSetHolidays();
  }, []);

  async function handleClickSave() {
    setShowDropOffDateWarning(false);
    setShowPickUpDateWarning(false);
    setSaving(true);
    setError(null);

    try {
      await put("/api/v1/order-dates.php", {
        id: props.orderId,
        dropOff,
        pickUp
      });

      let newOrders = [];

      orders.forEach(order => {
        if (+order.id === +props.orderId) {
          order.dropOff = dropOff;
          order.pickUp = pickUp;
        }
        newOrders.push(order);
      });

      setOrders(newOrders);
    } catch (errorMessage) {
      setError(errorMessage);
    }

    setSaving(false);
  }

  function dateIsHoliday(date) {
    return holidays.indexOf(date) > -1;
  }

  function dateIsInThePast(date) {
    return date < moment().format("YYYY-MM-DD");
  }

  function dateIsBeforeDropOffDate(date) {
    return date < dropOff;
  }

  // function dateIsAfterPickUpDate(date) {
  //   return date > pickUp;
  // }

  function closedThisDay(date) {
    let dayOfWeek = moment(date).isoWeekday();
    if (dayOfWeek === 7) {
      dayOfWeek = 0;
    }
    return closedDaysOfWeek.indexOf(dayOfWeek.toString()) > -1;
  }

  function isDropOffDateBlocked(date) {
    return (
      dateIsHoliday(date) ||
      // dateIsInThePast(date) ||
      // dateIsAfterPickUpDate(date) ||
      closedThisDay(date)
    );
  }

  function isPickUpDateBlocked(date) {
    return (
      dateIsHoliday(date) ||
      // dateIsInThePast(date) ||
      dateIsBeforeDropOffDate(date) ||
      closedThisDay(date)
    );
  }

  function renderWarnings() {
    let warningMessage = "";

    if (showDropOffDateWarning && showPickUpDateWarning) {
      warningMessage = "drop-off and pick-up dates are";
    } else if (showDropOffDateWarning) {
      warningMessage = "drop-off date is";
    } else if (showPickUpDateWarning) {
      warningMessage = "pick-up date is";
    }

    return warningMessage ? (
      <React.Fragment>
        <br />
        <br />
        <div className="alert alert-warning">{`Are you sure? The ${warningMessage} in the past.`}</div>
      </React.Fragment>
    ) : null;
  }

  function renderError() {
    return error ? <div className="alert alert-danger">Dates were not updated: {error}</div> : null;
  }

  if (!holidays) {
    return <Spinner />;
  }

  return (
    <div className="sidepanel__dates-tab">
      {renderError()}
      <SingleDatePickerRow
        date={dropOff}
        hasFocus={dropOffDateFocus}
        isDayBlocked={momentObj => isDropOffDateBlocked(momentObj.format("YYYY-MM-DD"))}
        label="Drop-off date"
        onDateChange={momentObj => {
          setDropOff(momentObj.format("YYYY-MM-DD"));
          setShowDropOffDateWarning(dateIsInThePast(momentObj.format("YYYY-MM-DD")));
        }}
        onFocusChange={() => {
          setDropOffDateFocus(oldState => !oldState);
        }}
      />

      <SingleDatePickerRow
        date={pickUp === NO_PICKUP_DATE ? null : pickUp}
        hasFocus={pickUpDateFocus}
        isDayBlocked={momentObj => isPickUpDateBlocked(momentObj.format("YYYY-MM-DD"))}
        label="Pick-up date"
        onDateChange={momentObj => {
          setPickUp(momentObj.format("YYYY-MM-DD"));
          setShowPickUpDateWarning(dateIsInThePast(momentObj.format("YYYY-MM-DD")));
        }}
        onFocusChange={() => {
          setPickUpDateFocus(oldState => !oldState);
        }}
      />

      <PendingButton pending={saving} onClick={handleClickSave} />

      {renderWarnings()}
    </div>
  );
}

Dates.propTypes = {
  dropOff: PropTypes.string.isRequired,
  orderId: PropTypes.number.isRequired,
  pickUp: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default function DatesWithContext(props) {
  return <Dates {...props} context={OrdersContext} />;
}
