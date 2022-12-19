import React from "react";
import "react-dates/initialize"; // This must be included or app dies
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "./DatePicker.scss";

export default function DatePicker({ date, setDate, onClickNextDate, onClickPreviousDate }) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="date-picker">
      <button className="prev glyphicon glyphicon-chevron-left btn btn-primary" onClick={onClickPreviousDate} />
      <SingleDatePicker
        focused={isFocused}
        date={date}
        numberOfMonths={1}
        displayFormat="dddd, MMMM D"
        onDateChange={setDate}
        onFocusChange={({ focused }) => {
          setIsFocused(focused);
        }}
        isOutsideRange={() => false}
        hideKeyboardShortcutsPanel
      />
      <button className="next glyphicon glyphicon-chevron-right btn btn-primary" onClick={onClickNextDate} />
    </div>
  );
}
