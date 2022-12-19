import React from "react";
import { Link } from "react-router-dom";
import { NO_PICKUP_DATE } from "Utils/constants.jsx";
import { formatDate } from "Utils/library.jsx";

export default function Orders({ customer, orders }) {
  if (customer === null || orders === null) {
    return null;
  }

  return (
    <table className="table customers__sidepanel__orders">
      <thead>
        <tr>
          <th className="id-column">ID</th>
          <th className="service-column">Service</th>
          <th className="date-column">Drop-Off &rarr; Pick-Up</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => {
          const cn = order.deleted ? "customers__sidepanel__orders__order--deleted" : null;
          const { id } = order;
          const title = order.deleted ? `DELETED - ${order.title}` : order.title;
          const link = order.deleted ? id : <Link to={`/back/orders?filter=${id}`}>{id}</Link>;
          const pickUpDate = order.endDateTime.indexOf(NO_PICKUP_DATE) > -1 ? "TBD" : formatDate(order.endDateTime);

          return (
            <tr key={id} className={cn}>
              <td>{link}</td>
              <td>{title}</td>
              <td>
                {formatDate(order.startDateTime)} &rarr; {pickUpDate}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
