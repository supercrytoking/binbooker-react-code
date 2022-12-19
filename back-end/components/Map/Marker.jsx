import React from "react";
import ReactTooltip from "react-tooltip";
import moment from "moment";

export default function Marker({ details }) {
  const pickUpDateString = details.endDate ? moment(details.endDate).format("ddd. MMM. D") : "TBD";

  const info = `Order: #${details.orderId}<br />
                Bin: ${details.binId}<br />
                Customer: ${details.name}<br />
                ${moment(details.startDate).format("ddd. MMM. D")} to ${pickUpDateString}`;

  return (
    <div>
      <div className="bins-map__marker" data-tip={info} data-multiline data-background-color="black" />
      <ReactTooltip />
    </div>
  );
}
