import React from "react";
import { bool, func, string } from "prop-types";
import "react-dates/initialize"; // This must be included or app dies
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import "./SingleDatePickerRow.scss";

export default function SingleDatePickerRow({ date, hasFocus, isDayBlocked, label, onDateChange, onFocusChange }) {
  const formattedDate = date ? moment(date) : null;

  return (
    <div className="form-group single-date-picker-row">
      <label>{label}</label>
      <div className="input-group date">
        <SingleDatePicker
          date={formattedDate}
          displayFormat="dddd, MMMM D, YYYY"
          focused={hasFocus}
          hideKeyboardShortcutsPanel
          id="dropoffDate"
          isDayBlocked={isDayBlocked}
          isOutsideRange={() => false}
          numberOfMonths={1}
          onDateChange={onDateChange}
          onFocusChange={onFocusChange}
          required
        />
        <span className="input-group-addon">
          <span className="glyphicon glyphicon-calendar" />
        </span>
      </div>
    </div>
  );
}

SingleDatePickerRow.propTypes = {
  date: string, // 2019-12-25
  hasFocus: bool,
  isDayBlocked: func.isRequired,
  label: string.isRequired,
  onDateChange: func.isRequired,
  onFocusChange: func.isRequired
};

SingleDatePickerRow.defaultProps = {
  date: null,
  hasFocus: false
};
