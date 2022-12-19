import React from "react";
import { object } from "prop-types";
import { SchedulePageContext } from "../../../SchedulePageContext.jsx";
import Spinner from "Components/Spinner";
import "./Appointment.scss";

export default function Appointment({ data }) {
  const [isSaving, setIsSaving] = React.useState(false);

  const {
    binId,
    binForeignId,
    companyName,
    customerId,
    customerNotes,
    deliveryStreet1,
    deliveryCity,
    firstName,
    lastName,
    isComplete,
    orderId,
    orderNotes,
    orderTruckId,
    phone,
    size,
    type,
    title
  } = data;
  const { allBins, handleSetNewBinId, setErrorMessage } = React.useContext(SchedulePageContext);
  const bins = allBins.filter(bin => bin.size === size);
  const types = { p: "Pick-up", d: "Drop-off" };

  function renderNotes(str) {
    return str.length > 0 ? <div className="notes">Notes: {str}</div> : null;
  }

  function renderIsComplete(isComplete) {
    if (!isComplete) {
      return null;
    }

    return (
      <span className="appointment__is-complete-flag">
        <div className="glyphicon glyphicon-ok" />
      </span>
    );
  }

  async function handleChangeDumpster(e) {
    e.persist();
    const originalBinId = binId;
    const newBinId = e.target.value;

    setIsSaving(true);
    setErrorMessage("");
    const success = await handleSetNewBinId(orderTruckId, newBinId);
    if (!success) {
      e.target.value = originalBinId;
      setErrorMessage("Change not saved due to availability; try choosing another dumpster.");
    }
    setIsSaving(false);
  }

  function binWasDeleted(binId) {
    const matchingBin = bins.find(bin => bin.id === binId);
    return matchingBin === undefined;
  }

  return (
    <div key={orderTruckId} data-id={orderTruckId}>
      <div className="schedule-page__appointment" key={`appointment${orderId}`} data-order-id={orderId}>
        <div className="title">
          <span className="glyphicon glyphicon-th" />
          Order #<a href={`orders?filter=${orderId}`}>{orderId}</a>
          {renderIsComplete(isComplete)}
        </div>
        <div className="details">
          <div className="half">
            {types[type]} {title}{" "}
            {type === "d" ? (
              <>
                <select disabled={isSaving} defaultValue={binId} onChange={handleChangeDumpster}>
                  {binWasDeleted(binId) && (
                    <option value={binId} key={binId}>
                      ??? (deleted)
                    </option>
                  )}
                  {bins
                    .filter(bin => bin.isActive === "1" || bin.id === binId)
                    .map(bin => (
                      <option value={bin.id} key={bin.id}>
                        {bin.foreignId}
                        {bin.isActive === "0" && " (inactive)"}
                      </option>
                    ))}
                </select>
                {isSaving && (
                  <div className="appointment__spinner-wrapper">
                    <Spinner size="tiny" />
                  </div>
                )}
              </>
            ) : (
              ` (${binForeignId})`
            )}
            <br />
            <div>
              {deliveryStreet1}, {deliveryCity}
            </div>
            {renderNotes(orderNotes)}
          </div>
          <div className="half">
            {companyName && <div>{companyName}</div>}
            <a href={`customers?filter=${customerId}`}>{`${firstName} ${lastName}`}</a>
            <br />
            <a href={`tel:${phone}`}>{phone}</a>
            <br />
            {renderNotes(customerNotes)}
          </div>
        </div>
      </div>
    </div>
  );
}

Appointment.propTypes = {
  data: object.isRequired
};
