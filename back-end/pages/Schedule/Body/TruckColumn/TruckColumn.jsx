import React from "react";
import { array, number, string } from "prop-types";
import Sortable from "react-sortablejs";
import Appointment from "./Appointment";
import Filler from "./Filler";
import SlotsStatus from "./SlotsStatus";
import AddFillerButton from "./AddFillerButton";
import { SchedulePageContext } from "../../SchedulePageContext.jsx";
import { arraySortByKey } from "Utils/library.jsx";
import "./TruckColumn.scss";

export default function TruckColumn({ appointments, truckName, truckId }) {
  const { date, handleChangeSchedule, handleCreateFiller, handleDeleteFiller } = React.useContext(SchedulePageContext);
  const numberOfSlotsFilled = appointments.length;

  function isAppointment(appointment) {
    return appointment.orderId !== null;
  }

  function renderAppointments(appointments) {
    appointments.sort(arraySortByKey("startDateTime"));

    return appointments.map(appointment => {
      if (isAppointment(appointment)) {
        return <Appointment key={appointment.orderTruckId} data={appointment} />;
      }

      return (
        <Filler
          key={appointment.orderTruckId}
          onDeleteFiller={() => {
            handleDeleteFiller(truckId, appointment.orderTruckId);
          }}
          orderTruckId={+appointment.orderTruckId}
        />
      );
    });
  }

  return (
    <div className="truck-column" data-truck-id={truckId}>
      <div>
        <span className="truck-name">{truckName}</span>
        <SlotsStatus className="truck-column__slots" date={date} numberOfSlotsFilled={numberOfSlotsFilled} />
      </div>
      <Sortable
        options={{
          animation: 150,
          group: {
            name: "sharedGroupName",
            pull: true,
            put: true
          },
          handle: ".glyphicon-th",
          chosenClass: "sortable-chosen",
          dragClass: "sortable-drag"
        }}
        className="appointments"
        onChange={(orderTruckIds, SortableObj, e) => {
          const movedOrderTruckId = e.item.getAttribute("data-id");
          if (orderTruckIds && orderTruckIds.indexOf(movedOrderTruckId) > -1) {
            const targetTruckId = e.to.parentElement.getAttribute("data-truck-id");
            handleChangeSchedule(targetTruckId, orderTruckIds, movedOrderTruckId);
          }
        }}
      >
        {renderAppointments(appointments)}
      </Sortable>
      <AddFillerButton
        date={date}
        numberOfSlotsFilled={numberOfSlotsFilled}
        onClick={() => {
          handleCreateFiller(truckId, date);
        }}
      />
    </div>
  );
}

TruckColumn.propTypes = {
  appointments: array.isRequired,
  truckName: string.isRequired,
  truckId: number.isRequired
};
