import React from "react";
import SidePanel from "Components/SidePanel";
import { Tabs, Tab } from "react-bootstrap";
import AddressTab from "./Tabs/Address";
import AttachmentsTab from "./Tabs/Attachments";
import DatesTab from "./Tabs/Dates";
import DetailTab from "./Tabs/Detail";
import ItemsTab from "./Tabs/Items";
import { ActiveOrderContext } from "../ActiveOrderContext";

export default function OrdersSidePanel({ user }) {
  const { activeOrder, setActiveOrder } = React.useContext(ActiveOrderContext);

  const activeOrderId = activeOrder ? activeOrder.id : "";

  return (
    <SidePanel
      open={activeOrder !== null}
      onClose={() => {
        setActiveOrder(null);
      }}
      heading={`Order ${activeOrderId}`}
    >
      <Tabs defaultActiveKey="items" id="ordersTab">
        <Tab title="Items" eventKey="items">
          {activeOrder && (
            <ItemsTab
              orderId={activeOrder.id}
              afterDeleteItem={() => {}}
              tax1={+user.tax1}
              tax1Name={user.tax1Name}
              tax2={+user.tax2}
              tax2Name={user.tax2Name}
              stripeId={activeOrder.stripeId}
            />
          )}
        </Tab>
        <Tab title="Dates" eventKey="dates">
          {activeOrder && (
            <DatesTab dropOff={activeOrder.dropOff} orderId={+activeOrder.id} pickUp={activeOrder.pickUp} user={user} />
          )}
        </Tab>
        <Tab title="Address" eventKey="address">
          {activeOrder && <AddressTab order={activeOrder} afterSave={() => {}} currency={user.currency} />}
        </Tab>
        <Tab title="Attachments" eventKey="attachments">
          {activeOrder && <AttachmentsTab attachments={activeOrder.attachments} />}
        </Tab>
        <Tab title="Detail" eventKey="detail">
          {activeOrder && <DetailTab createdBy={activeOrder.createdBy} createdOn={activeOrder.createdOn} />}
        </Tab>
      </Tabs>
    </SidePanel>
  );
}
