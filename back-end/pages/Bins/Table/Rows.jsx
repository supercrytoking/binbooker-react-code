import React from "react";
import { BinsContext } from "../BinsContainer";
import StatusCalendar from "./StatusCalendar";
import { useDebouncedCallback } from "use-debounce";

export default function Row() {
  const { bins, setActiveBin, setIsSidePanelOpen } = React.useContext(BinsContext);
  const [numberOfDaysToShow, setNumberOfDaysToShow] = React.useState(getNumberOfDaysToShow());

  function getNumberOfDaysToShow() {
    const availableWidth = (document.querySelector(".app-wrapper main").clientWidth - 20) * 0.7 - 20; // "Availability" column uses 70% of table
    const widthPerCell = 30;
    const numberOfDaysThatFit = availableWidth / widthPerCell;
    const maxDays = 30; // this is also set in api/v2/bins.php
    return numberOfDaysThatFit > maxDays ? maxDays : Math.floor(numberOfDaysThatFit);
  }

  const debouncedResize = useDebouncedCallback(() => {
    const newNumberOfDaysToShow = getNumberOfDaysToShow();
    setNumberOfDaysToShow(newNumberOfDaysToShow);
  }, 200);

  // as screen resizes, recalculate
  React.useEffect(() => {
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  return bins.map(bin => (
    <tr
      key={bin.id}
      onClick={() => {
        const { id, foreignId, size, isActive } = bin;
        setActiveBin({ id, foreignId, size, isActive: isActive });
        setIsSidePanelOpen(true);
      }}
    >
      <td>{bin.foreignId}</td>
      <td>{bin.size}</td>
      <td>{bin.isActive === "1" ? "Yes" : "No"}</td>
      <td>
        <StatusCalendar
          binId={bin.id}
          binIsActive={!!+bin.isActive}
          numberOfDaysToShow={numberOfDaysToShow}
          orders={bin.orders}
        />
      </td>
    </tr>
  ));
}
