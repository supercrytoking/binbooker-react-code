import React from "react";
import Table from "./Table";
import BinSidePanel from "./BinSidePanel";
import MapSidePanel from "./MapSidePanel";
import { BinsContext } from "./BinsContainer";
import "./Bins.scss";

export default function Bins() {
  const { error, isPending, setIsDeleteModalOpen, setIsSidePanelOpen } = React.useContext(BinsContext);

  let prevIsPending = React.useRef(null); // the previous value of "isPending"

  React.useEffect(() => {
    document.title = "Bins";
  }, []);

  // after create, save, delete
  React.useEffect(() => {
    if (!isPending) {
      setIsDeleteModalOpen(false);

      //if there is no error and they didnt just clear it (because 'isPending' doesnt change when you clear it)
      if (!error && prevIsPending.current) {
        setIsSidePanelOpen(false);
      }
    }
    prevIsPending.current = isPending;
  }, [error, isPending]);

  return (
    <div className="bins-container">
      <Table />
      <BinSidePanel />
      <MapSidePanel />
    </div>
  );
}
