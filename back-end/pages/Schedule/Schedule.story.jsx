import React from "react";
import { storiesOf } from "@storybook/react";
import TruckPicker from "Components/TruckPicker";
import Schedule from ".";

storiesOf("App Pages/Schedule", module)
  .add("TruckPicker", () => (
    <TruckPicker
      trucks={[
        { id: 1, name: "Truck 1" },
        { id: 2, name: "Truck 2" }
      ]}
      activeTruckId={2}
      onChange={() => {
        console.log("changed truck");
      }}
    />
  ))
  .add("Schedule", () => (
    <Schedule
      loading={false}
      onChange={(items, SortableObj, e) => {
        // Note: this fires twice if move it from truck 1 to truck 2, but only once if re-order a truck...
        if (items.indexOf(e.item.getAttribute("data-id")) > -1) {
          // var fromTruckId = e.from.parentElement.getAttribute('data-truck-id');
          var toTruckId = e.to.parentElement.getAttribute("data-truck-id");
          alert(
            `update orderTruckId ${e.item.getAttribute(
              "data-id"
            )} to belong to truck ${toTruckId}.  the new order for that truck is: ${items}`
          );
        }
      }}
      trucks={[
        {
          id: 1,
          name: "Truck 1",
          appointments: [
            {
              orderId: 11,
              orderTruckId: 111,
              type: "d",
              title: "20 yard",
              binId: 55,
              deliveryStreet1: "12 Fake Street",
              isComplete: 1,
              orderNotes: "Order notes go here",
              firstName: "Jamie",
              lastName: "Kupka",
              email: "jamie@fake.com",
              customerNotes: "Customer notes too",
              phone: "111-222-3333"
            },
            {
              orderId: 22,
              orderTruckId: 222,
              type: "p",
              title: "40 yard",
              binId: 66,
              deliveryStreet1: "905 Rocky Road",
              isComplete: 0,
              orderNotes: "",
              firstName: "Kerri",
              lastName: "Becker",
              email: "kerri@fake.com",
              customerNotes: "My beautiful wife",
              phone: "999-888-7777"
            }
          ]
        },
        {
          id: 2,
          name: "Truck 2",
          appointments: [
            {
              orderId: 3,
              orderTruckId: 333,
              type: "p",
              title: "10 yard",
              binId: 11,
              deliveryStreet1: "642 Evergreen Terrace",
              isComplete: 1,
              orderNotes: "",
              firstName: "Homer",
              lastName: "Simpson",
              email: "homer@fox.com",
              customerNotes: "",
              phone: "505-111-2222"
            }
          ]
        }
      ]}
    />
  ));
