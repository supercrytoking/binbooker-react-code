import { get, put } from "Utils/services.jsx";
import { arraySortByKey } from "Utils/library.jsx";

export async function getTrucks() {
  return await get(`/api/v1/trucks.php`);
}

export async function getSchedule(truckId, date) {
  const json = await get(`/api/v1/truck-schedule.php?id=${truckId}&date=${date}`);

  //modify the returned appointments, change "isComplete" from a string to a boolean
  const appointments = json.appointments;
  appointments.forEach(appointment => {
    appointment.isComplete = appointment.isComplete === 1;
  });

  appointments.sort(arraySortByKey("startDateTime"));

  return appointments;
}

export async function toggleAppointment(appointment, truckId) {
  await put(`/api/v1/truck-schedule.php`, {
    otId: appointment.orderTruckId,
    truckId,
    isComplete: !appointment.isComplete
  });
}
