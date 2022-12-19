import React from "react";
import TruckColumn from "./TruckColumn";
import { SchedulePageContext } from "../SchedulePageContext.jsx";
import Spinner from "Components/Spinner";
import "./Body.scss";

export default function Body() {
  const { isLoading, trucks } = React.useContext(SchedulePageContext);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="schedule-body">
      {trucks.map(truck => (
        <TruckColumn appointments={truck.appointments} key={truck.id} truckName={truck.foreignId} truckId={+truck.id} />
      ))}
    </div>
  );
}
