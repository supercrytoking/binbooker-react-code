import React from "react";
import PropTypes from "prop-types";
import momentPropTypes from "react-moment-proptypes";
import { UserContext } from "../../../UserProvider.jsx";
import { get } from "Utils/services.jsx";
import Date from "./Date.jsx";

export default function DateContainer({
  dontChoosePickUpDateIsChecked,
  dropOffDate,
  isBackEnd,
  onChange,
  onClickBack,
  onToggleDontChoosePickUpDate,
  onValidContinue,
  pickUpDate
}) {
  const user = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [fullyBookedDates, setFullyBookedDates] = React.useState(null);
  const [holidays, setHolidays] = React.useState(null);

  //fetch them every time this page loads...? that's not ideal... though it may change (use react-query)

  React.useEffect(() => {
    const fetchEverything = async function() {
      setIsLoading(true);
      const _fullyBookedDates = await get(`/api/v2/fully-booked-dates`);
      setFullyBookedDates(_fullyBookedDates);

      const _holidays = await get(`/api/v2/holidays`);
      setHolidays(_holidays.map(holiday => holiday.date));
      setIsLoading(false);
    };

    fetchEverything();
  }, []);

  function handleClickContinue() {
    if (dontChoosePickUpDateIsChecked) {
      if (dropOffDate) {
        setError("");
        onValidContinue();
      } else {
        setError("Please click an enabled date in the calendar as the drop-off date.");
      }
    } else {
      if (dropOffDate && pickUpDate) {
        setError("");
        onValidContinue();
      } else {
        if (!dropOffDate && !pickUpDate) {
          setError(
            "You did not choose any dates. Please click on two dates in the calendar: first the drop-off date, then the pick-up date."
          );
        } else {
          setError(
            "You did not choose a pick-up date. Please click on two dates in the calendar: first the drop-off date, then the pick-up date."
          );
        }
      }
    }
  }

  return (
    <Date
      colour={user.colour}
      customUserText={user.dateText}
      dontChoosePickUpDateIsChecked={dontChoosePickUpDateIsChecked}
      dropOffDate={dropOffDate}
      error={error}
      fullyBookedDates={fullyBookedDates}
      holidays={holidays}
      isBackEnd={isBackEnd}
      isLoading={isLoading}
      isPickUpDateMandatory={user.pickUpDateMandatory}
      onClickBack={onClickBack}
      onChange={onChange}
      onToggleDontChoosePickUpDate={onToggleDontChoosePickUpDate}
      onValidContinue={handleClickContinue}
      pickUpDate={pickUpDate}
    />
  );
}

DateContainer.propTypes = {
  deliveryPostalCode: PropTypes.string,
  dropOffDate: momentPropTypes.momentObj,
  isBackEnd: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  onToggleDontChoosePickUpDate: PropTypes.func.isRequired,
  onValidContinue: PropTypes.func.isRequired,
  pickUpDate: momentPropTypes.momentObj
};

DateContainer.defaultProps = {
  deliveryPostalCode: null,
  dropOffDate: null,
  isBackEnd: false,
  pickUpDate: null
};
