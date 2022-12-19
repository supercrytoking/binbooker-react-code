import React from "react";
import moment from "moment";
import { Tabs, Tab } from "react-bootstrap";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import DatePicker from "Components/DatePicker";
import TruckPicker from "Components/TruckPicker";
import SidePanel from "Components/SidePanel";
import TruckAppointments from "./TruckAppointments/TruckAppointments.jsx";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import AttachmentsTab from "../Orders/SidePanel/Tabs/Attachments";
import ItemsTab from "../Orders/SidePanel/Tabs/Items";
import { getSchedule, getTrucks, toggleAppointment } from "./api";
import ActiveOrderProvider, { ActiveOrderContext } from "../Orders/ActiveOrderContext";
import UserProvider, { UserContext } from "../../UserProvider.jsx";
import OrdersProvider, { OrdersContext } from "../Orders/OrdersContext.jsx";

import "./TruckSchedule.scss";

// Less important:
// TODO: react-query (so truck's schedule updates itself every x minutes)
// TODO: could use react-query to cache requests
// TODO: Schedule story does not work

export function TruckSchedule() {
  const today = moment();
  const [activeDate, setActiveDate] = React.useState(today);

  const [trucks, setTrucks] = React.useState(null);
  const [activeTruckId, setActiveTruckId] = React.useState(null);

  const [appointments, setAppointments] = React.useState(null);

  const { setOrders } = React.useContext(OrdersContext);
  const { activeOrder, setActiveOrder } = React.useContext(ActiveOrderContext);
  const user = React.useContext(UserContext);

  async function fetchAndSetSchedule() {
    if (activeTruckId) {
      const appointments = await getSchedule(activeTruckId, activeDate.format("YYYY-MM-DD"));
      setAppointments(appointments.filter(appointment => appointment.type !== "f"));
    }
  }

  React.useEffect(() => {
    document.title = "Truck's Schedule";

    function initializeContext() {
      setOrders([]); // The "Items" sidepanel needs this
    }

    async function fetchAndSetTrucks() {
      const trucks = await getTrucks();
      setTrucks(trucks);

      if (trucks.length) {
        setActiveTruckId(trucks[0].id);
      }
    }

    initializeContext();
    fetchAndSetTrucks();
  }, []);

  React.useEffect(() => {
    fetchAndSetSchedule();
  }, [activeDate, activeTruckId]);

  function handleSetActiveOrder(clickedAppointment) {
    setActiveOrder({
      id: clickedAppointment.orderId,
      attachments: clickedAppointment.attachments,
      items: clickedAppointment.items,
      stripeId: clickedAppointment.stripeId
    });
  }

  async function handleToggleAppointment(appointment) {
    await toggleAppointment(appointment, activeTruckId);
    await fetchAndSetSchedule();
  }

  function handleChangeTruck(truckId) {
    setAppointments(null);
    setActiveTruckId(truckId);
  }

  function handleClickNextDate() {
    setAppointments(null);
    const tomorrow = moment(activeDate).add(1, "days");
    setActiveDate(tomorrow);
  }

  function handleClickPrevDate() {
    setAppointments(null);
    const yesterday = moment(activeDate).subtract(1, "days");
    setActiveDate(yesterday);
  }

  function handleCloseSidePanel() {
    setActiveOrder(null);
  }

  const isLookingAtToday = activeDate.format("YYYY-MM-DD") === today.format("YYYY-MM-DD");
  const activeOrderId = (activeOrder && activeOrder.id) || null;

  return (
    <div className="schedule-app">
      <header>
        <DatePicker
          date={activeDate}
          setDate={setActiveDate}
          onClickNextDate={handleClickNextDate}
          onClickPreviousDate={handleClickPrevDate}
        />
        {trucks && trucks.length > 1 && <TruckPicker includeAll={false} onChange={handleChangeTruck} trucks={trucks} />}
      </header>
      {!appointments && <SpinnerCentred />}
      {appointments && (
        <TruckAppointments
          appointmentsArray={appointments}
          canToggleAppointments={isLookingAtToday}
          onSetActiveOrder={handleSetActiveOrder}
          onToggleAppointment={handleToggleAppointment}
        />
      )}
      <SidePanel open={activeOrder !== null} onClose={handleCloseSidePanel} heading={`Order ${activeOrderId}`}>
        <Tabs defaultActiveKey="items" id="truck-schedule-tabs-id-for-accessibility">
          <Tab title="Items" eventKey="items">
            {activeOrder && (
              <ItemsTab
                showOverflowMenu={false}
                orderId={+activeOrder.id}
                tax1={+user.tax1}
                tax1Name={user.tax1Name}
                tax2={+user.tax2}
                tax2Name={user.tax2Name}
                stripeId={activeOrder.stripeId}
              />
            )}
          </Tab>
          <Tab title="Attachments" eventKey="attachments">
            {activeOrder && <AttachmentsTab attachments={activeOrder.attachments} />}
          </Tab>
        </Tabs>
      </SidePanel>
    </div>
  );
}

export default function TruckScheduleWithProviders() {
  return (
    <LoggedInStaffContext.Consumer>
      {loggedInStaff => {
        if (!loggedInStaff.pageAccess.truckSchedule) {
          return null;
        }

        return (
          <ActiveOrderProvider>
            <UserProvider>
              <OrdersProvider>
                <TruckSchedule />
              </OrdersProvider>
            </UserProvider>
          </ActiveOrderProvider>
        );
      }}
    </LoggedInStaffContext.Consumer>
  );
}
