import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import momentPropTypes from "react-moment-proptypes";
import "react-dates/initialize";
import { SingleDatePicker, DateRangePicker } from "react-dates";
import CustomizableCalendarDay from "react-dates/lib/components/CustomizableCalendarDay";
import { START_DATE, END_DATE } from "react-dates/constants";
import "react-dates/lib/css/_datepicker.css";
import { OverlayTrigger, Popover } from "react-bootstrap";
import Spinner from "Components/Spinner";
import CustomUserText from "../components/CustomUserText/CustomUserText.jsx";
import CreateOrderActionBar from "../components/ActionBar/create-order-action-bar.jsx";
import DontChoosePickUpDateToggle from "./DontChoosePickUpDateToggle";
import ClearDatesButton from "./ClearDatesButton";
import { getReactDatesCustomDayStyles, scrollToTop } from "Utils/library.jsx";
import "./Date.scss";

export default function Date({
  colour,
  customUserText,
  dontChoosePickUpDateIsChecked,
  dropOffDate,
  error,
  fullyBookedDates,
  holidays,
  isBackEnd,
  isLoading,
  isPickUpDateMandatory,
  onChange,
  onClickBack,
  onToggleDontChoosePickUpDate,
  onValidContinue,
  pickUpDate
}) {
  const [focusedInput, setFocusedInput] = React.useState(START_DATE);
  const [orientation, setOrientation] = React.useState(getOrientation());

  const CUTOFF_DATE = moment().add(90, "days");
  const customDayStyles = getReactDatesCustomDayStyles(colour);

  React.useEffect(() => {
    document.title = `Rent a dumpster | Date`;
    scrollToTop();

    window.onresize = () => {
      setOrientation(getOrientation());
    };
  }, []);

  React.useEffect(scrollToTop, [error]);

  // Don't let the calendar close
  React.useEffect(() => {
    if (!focusedInput) {
      setFocusedInput(START_DATE);
    }
  }, [focusedInput]);

  function getOrientation() {
    return window.innerWidth <= 600 ? "vertical" : "horizontal";
  }

  function dateIsInThePast(momentObj) {
    // In the back-end, they can book today
    // In the front-end, they can only book for tomorrow
    return isBackEnd
      ? momentObj.format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")
      : momentObj.format("YYYY-MM-DD") <= moment().format("YYYY-MM-DD");
  }

  function dateIsAfterCutoffDate(momentObj) {
    return momentObj._d > CUTOFF_DATE;
  }

  function dateIsFullyBooked(momentObj) {
    return fullyBookedDates && fullyBookedDates.indexOf(momentObj.format("YYYY-MM-DD")) > -1;
  }

  function dateIsHoliday(momentObj) {
    return holidays && holidays.indexOf(momentObj.format("YYYY-MM-DD")) > -1;
  }

  function isDayBlocked(momentObj) {
    return (
      dateIsInThePast(momentObj) ||
      dateIsAfterCutoffDate(momentObj) ||
      dateIsFullyBooked(momentObj) ||
      dateIsHoliday(momentObj)
    );
  }

  function getDateDisabledReasonText(momentObj) {
    if (dateIsInThePast(momentObj)) {
      return "This date is in the past";
    }
    if (dateIsAfterCutoffDate(momentObj)) {
      return "Please contact us directly to book this far in advance.";
    }
    if (dateIsFullyBooked(momentObj)) {
      return "This date is fully booked.";
    }
    if (dateIsHoliday(momentObj)) {
      return "This date is a holiday.";
    }
  }

  function renderErrors() {
    return error && <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: error }} />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  function renderDayContents(momentObj) {
    if (isDayBlocked(momentObj)) {
      const dayDisabledPopover = (
        <Popover id="day-disabled-popover">
          <span>{getDateDisabledReasonText(momentObj)}</span>
        </Popover>
      );

      return (
        <OverlayTrigger delayShow={500} placement="right" overlay={dayDisabledPopover}>
          <span>{momentObj.format("D")}</span>
        </OverlayTrigger>
      );
    }

    return momentObj.format("D");
  }

  function handleClearDates() {
    onChange({ startDate: null, endDate: null });
  }

  return (
    <div className="create-order-date-wrapper">
      <div className="row">
        <label className="control-label create-order__step-label">Choose your dates:</label>
      </div>

      <CustomUserText text={customUserText} />
      {renderErrors()}

      {!isPickUpDateMandatory && (
        <DontChoosePickUpDateToggle isChecked={dontChoosePickUpDateIsChecked} onClick={onToggleDontChoosePickUpDate} />
      )}
      <div className="row">
        <div className="col-md-12">
          {dontChoosePickUpDateIsChecked ? (
            <SingleDatePicker
              date={dropOffDate}
              focused
              id="date_input"
              onDateChange={onChange}
              placeholder="Drop-off date"
              numberOfMonths={1}
              onFocusChange={() => {}}
              keepOpenOnDateSelect
              displayFormat="ddd. MMM. D"
              hideKeyboardShortcutsPanel
              isDayBlocked={momentObj => isDayBlocked(momentObj)}
              orientation={orientation}
              renderDayContents={renderDayContents}
              renderCalendarDay={props => <CustomizableCalendarDay {...props} {...customDayStyles} />}
            />
          ) : (
            <DateRangePicker
              startDate={dropOffDate}
              startDateId={START_DATE}
              endDate={pickUpDate}
              endDateId={END_DATE}
              onDatesChange={onChange}
              startDatePlaceholderText="Drop-off date"
              endDatePlaceholderText="Pick-up date"
              keepOpenOnDateSelect
              displayFormat="ddd. MMM. D"
              focusedInput={focusedInput}
              onFocusChange={setFocusedInput}
              hideKeyboardShortcutsPanel
              isDayBlocked={momentObj => isDayBlocked(momentObj)}
              minimumNights={isBackEnd ? 0 : 1}
              orientation={orientation}
              renderDayContents={renderDayContents}
              renderCalendarDay={props => <CustomizableCalendarDay {...props} {...customDayStyles} />}
            />
          )}
          <ClearDatesButton dropOffDate={dropOffDate} onClick={handleClearDates} />
        </div>
      </div>
      <CreateOrderActionBar
        loading={isLoading}
        disabled={false}
        onClickBack={onClickBack}
        onClickContinue={onValidContinue}
      />
    </div>
  );
}

Date.propTypes = {
  customUserText: PropTypes.string,
  dropOffDate: momentPropTypes.momentObj,
  error: PropTypes.string,
  fullyBookedDates: PropTypes.array,
  holidays: PropTypes.array,
  isBackEnd: PropTypes.bool,
  isLoading: PropTypes.bool,
  isPickUpDateMandatory: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  onToggleDontChoosePickUpDate: PropTypes.func.isRequired,
  onValidContinue: PropTypes.func.isRequired,
  pickUpDate: momentPropTypes.momentObj
};

Date.defaultProps = {
  customUserText: "",
  dropOffDate: "",
  error: "",
  fullyBookedDates: [],
  holidays: [],
  isBackEnd: false,
  isLoading: false,
  isPickUpDateMandatory: true,
  pickUpDate: ""
};
