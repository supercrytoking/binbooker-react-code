import React from "react";
import Map from "Components/Map";
import SidePanel from "Components/SidePanel";
import { NO_PICKUP_DATE } from "Utils/constants";
import { BinsContext } from "../BinsContainer";

export default function MapSidePanel() {
  const { orders, isMapSidePanelOpen, setIsMapSidePanelOpen } = React.useContext(BinsContext);

  const width = window.innerWidth - 20;
  const height = window.innerHeight - 70;

  if (!orders) {
    return null;
  }

  const locations = orders
    .filter(bin => bin.orderId)
    .map(order => ({
      address: {
        street: order.deliveryStreet1,
        city: order.deliveryCity,
        province: order.deliveryProvince,
        postalCode: order.deliveryPostalCode
      },
      details: {
        orderId: order.orderId,
        name: order.companyName || `${order.firstName} ${order.lastName}`,
        binId: order.foreignId,
        startDate: order.startDateTime,
        endDate: order.endDateTime.indexOf(NO_PICKUP_DATE) > -1 ? null : order.endDateTime
      }
    }));

  return (
    <SidePanel
      open={isMapSidePanelOpen}
      onClose={() => {
        setIsMapSidePanelOpen(false);
      }}
      heading="Bin Locations"
      width="large"
    >
      <div className="bins-locations">
        <Map locations={locations} isVisible={isMapSidePanelOpen} width={width} height={height} />
      </div>
    </SidePanel>
  );
}
