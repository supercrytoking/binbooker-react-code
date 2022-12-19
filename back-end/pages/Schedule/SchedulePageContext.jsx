import React from "react";
import moment from "moment";
import { get, post, put, remove } from "Utils/services.jsx";

export const SchedulePageContext = React.createContext();

export default function SchedulePageProvider({ children }) {
  const today = moment();
  const [activeTruckId, setActiveTruckId] = React.useState(null);
  const [allBins, setAllBins] = React.useState([]);
  const [allTrucks, setAllTrucks] = React.useState([]);
  const [date, setDate] = React.useState(today);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [trucks, setTrucks] = React.useState([]); //contains the selected truck(s) and their daily schedule

  const firstRender = React.useRef(true);

  // TODO: can any of this state be moved into the components?
  //       activeTruckId/setActiveTruckId probably can

  const thingsToShare = {
    activeTruckId,
    setActiveTruckId,
    allTrucks,
    setAllTrucks,
    trucks,
    handleChangeTruck,
    //
    allBins,
    setAllBins,
    //
    date,
    setDate,
    getSchedule,
    handleChangeSchedule,
    handleClickNextDate,
    handleClickPreviousDate,
    handleCreateFiller,
    handleDeleteFiller,
    //
    isLoading,
    setIsLoading,
    //
    handleClearErrorMessage,
    errorMessage,
    setErrorMessage,
    //
    handleSetNewBinId
  };

  React.useEffect(() => {
    getSchedule(true);
  }, []);

  React.useEffect(() => {
    if (!firstRender.current) {
      getSchedule();
    }
    firstRender.current = false;
  }, [date, activeTruckId]);

  async function getSchedule(populateTrucks = false) {
    setIsLoading(true);
    const json = await get(`/api/v2/schedule?date=${date.format("YYYY-MM-DD")}&truckId=${activeTruckId}`);

    if (populateTrucks) {
      setAllTrucks(json.trucks);
      setAllBins(json.bins);
    }

    setTrucks(json.trucks);
    setIsLoading(false);
  }

  async function handleChangeSchedule(targetTruckId, newOrderOfOrderTruckIds, movedOrderTruckId) {
    // Note: this fires twice if move it from truck 1 to truck 2, but only once if re-order a truck...

    setIsLoading(true);

    try {
      await post("/api/v2/schedule", {
        targetTruckId,
        newOrderOfOrderTruckIds,
        movedOrderTruckId
      });
      getSchedule();
    } catch (errorMessage) {
      setIsLoading(false);
      setErrorMessage([errorMessage]);
    }
  }

  function handleChangeTruck(truckId) {
    setActiveTruckId(+truckId);
  }

  function handleClickPreviousDate() {
    const newDate = moment(date).subtract(1, "days");
    setDate(newDate);
  }

  function handleClickNextDate() {
    const newDate = moment(date).add(1, "days");
    setDate(newDate);
  }

  function handleClearErrorMessage() {
    setErrorMessage("");
  }

  async function handleCreateFiller(truckId, date) {
    try {
      await post(`/api/v2/truck/${truckId}/orderTruck`, {
        date: date.format("YYYY-MM-DD")
      });
      getSchedule();
    } catch (errorMessage) {
      setErrorMessage("Filler not created. The day is probably already full..");
    }
  }

  async function handleDeleteFiller(truckId, orderTruckId) {
    try {
      await remove(`/api/v2/truck/${truckId}/orderTruck/${orderTruckId}`);
      //remove it (instead of getting schedule again)
      getSchedule();
    } catch (errorMessage) {
      setErrorMessage("Filler not deleted.");
    }
  }

  async function handleSetNewBinId(orderTruckId, newBinId) {
    try {
      await put(`/api/v2/schedule/`, { orderTruckId, newBinId });
      getSchedule(); // in case the pick-up is also on screen, we want to see it using the new dumpster
      return true;
    } catch {
      return false;
    }
  }

  return <SchedulePageContext.Provider value={thingsToShare}>{children}</SchedulePageContext.Provider>;
}
