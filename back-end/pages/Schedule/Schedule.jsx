import React from "react";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import DatePicker from "Components/DatePicker";
import TruckPicker from "Components/TruckPicker";
import Errors from "Components/Errors";
import Body from "./Body";
import SchedulePageProvider, { SchedulePageContext } from "./SchedulePageContext.jsx";
import "./Schedule.scss";

export function SchedulePage() {
  const {
    activeTruckId,
    allTrucks,
    errorMessage,
    handleChangeTruck,
    handleClearErrorMessage,
    date,
    setDate,
    handleClickNextDate,
    handleClickPreviousDate
  } = React.useContext(SchedulePageContext);

  React.useEffect(() => {
    document.title = "Schedule";
  }, []);

  return (
    <div id="schedule-container">
      <header>
        <DatePicker
          date={date}
          setDate={setDate}
          onClickNextDate={handleClickNextDate}
          onClickPreviousDate={handleClickPreviousDate}
        />
        {allTrucks.length > 1 && (
          <TruckPicker trucks={allTrucks} activeTruckId={activeTruckId} onChange={handleChangeTruck} />
        )}
      </header>
      {errorMessage && <Errors errors={[errorMessage]} onDismiss={handleClearErrorMessage} />}
      <Body />
    </div>
  );
}

export default function SchedulePageWithContext() {
  return (
    <LoggedInStaffContext.Consumer>
      {loggedInStaff => {
        if (!loggedInStaff.pageAccess.schedule) {
          return null;
        }

        return (
          <SchedulePageProvider>
            <SchedulePage />
          </SchedulePageProvider>
        );
      }}
    </LoggedInStaffContext.Consumer>
  );
}
