import React from "react";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import Bubbly from "Components/Bubbly";
import { BinsContext } from "../BinsContainer";
import Rows from "./Rows";

export default function Table() {
  const { bins, holidays, setActiveBin, setIsSidePanelOpen, setIsMapSidePanelOpen } = React.useContext(BinsContext);

  if (!bins || !holidays) {
    return <SpinnerCentred />;
  }

  if (!bins.length) {
    return (
      <Bubbly
        title="No Bins"
        description="Click the button below to create your first Bin."
        actionTitle="Create new Bin"
        onClick={handleClickCreateNewBin}
      />
    );
  }

  function handleClickCreateNewBin() {
    setActiveBin({ id: null, foreignId: "", size: "", isActive: "1" });
    setIsSidePanelOpen(true);
  }

  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="bin__id">ID</th>
            <th className="bin__size">Size</th>
            <th className="bin__active">Rentable?</th>
            <th className="bin__status">
              <span className="bin__status__heading">Availability</span>
              <button
                className="btn btn-default bin-location-button"
                onClick={() => {
                  setIsMapSidePanelOpen(true);
                }}
              >
                <i className={`glyphicon glyphicon-map-marker`} />
                <span className="bin-locations-text">&nbsp; Map of bin locations</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <Rows />
        </tbody>
      </table>
      <div className="bins-container__add-button">
        <button className="btn btn-default" onClick={handleClickCreateNewBin}>
          Create new Bin
        </button>
      </div>
    </>
  );
}
