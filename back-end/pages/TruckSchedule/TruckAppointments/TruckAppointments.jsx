import React from "react";
import { array, bool, func } from "prop-types";
import TruckAppointment from "./TruckAppointment/TruckAppointment.jsx";

export default function TruckAppointments({
  appointmentsArray,
  canToggleAppointments,
  onSetActiveOrder,
  onToggleAppointment
}) {
  function isAppointment(appointmentOrFiller) {
    return "orderId" in appointmentOrFiller;
  }

  if (!appointmentsArray) {
    return null;
  }

  if (appointmentsArray.length === 0) {
    return <span>No appointments.</span>;
  }

  // A filler could/should be its own component, though it shares so much with TruckAppointment, would have to abstract that
  // Like:
  // <SomeAppointment isComplete onClick>
  //   <TruckAppointment /> or <Filler />
  // </SomeAppointment>

  return appointmentsArray.map(appointment =>
    isAppointment(appointment) ? (
      <TruckAppointment
        key={appointment.orderTruckId}
        type={appointment.type}
        orderId={appointment.orderId}
        binForeignId={appointment.binForeignId}
        title={appointment.title}
        orderNotes={appointment.orderNotes}
        companyName={appointment.companyName}
        firstName={appointment.firstName}
        lastName={appointment.lastName}
        phone={appointment.phone}
        email={appointment.email}
        customerNotes={appointment.customerNotes}
        deliveryCity={appointment.deliveryCity}
        deliveryPostalCode={appointment.deliveryPostalCode}
        deliveryProvince={appointment.deliveryProvince}
        deliveryStreet1={appointment.deliveryStreet1}
        endDateTime={appointment.endDateTime}
        startDateTime={appointment.startDateTime}
        canToggleAppointments={canToggleAppointments}
        onToggleAppointment={() => {
          onToggleAppointment(appointment);
        }}
        onSetActiveOrder={() => {
          onSetActiveOrder(appointment);
        }}
        isComplete={appointment.isComplete}
      />
    ) : (
      <TruckAppointment
        key={appointment.orderTruckId}
        type="f"
        canToggleAppointments={canToggleAppointments}
        onToggleAppointment={() => {
          onToggleAppointment(appointment);
        }}
        isComplete={appointment.isComplete}
      />
    )
  );
}

TruckAppointments.propTypes = {
  appointmentsArray: array,
  canToggleAppointments: bool.isRequired,
  onToggleAppointment: func.isRequired,
  onSetActiveOrder: func.isRequired
};

TruckAppointments.defaultProps = {
  appointmentsArray: null
};
