import React from "react";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import Bins from "./Bins.jsx";
import Spinner from "Components/Spinner";
import { get, post, put, remove } from "Utils/services.jsx";

// TODO: This new code is cleaner as it uses context and broke everything down into smaller components.
//       But since it uses context, all the children re-render when any state changes.
//       For example, open the sidepanel, the Table re-renders
//       I tried adding React.memo() on <Table /> and React.useCallback on the three onXxxx methods, but it didnt resolve it
//       I guess because <Bins /> gets re-rendered, so all of its child components get re-rendered

export const BinsContext = React.createContext();

export default function BinsContainer() {
  const BINS_ENDPOINT = "/api/v2/bins";

  const [bins, setBins] = React.useState(null);
  const [holidays, setHolidays] = React.useState(null);
  const [orders, setOrders] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isPending, setIsPending] = React.useState(false);

  const [activeBin, setActiveBin] = React.useState({ id: null, foreignId: "", size: "", isActive: false });

  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isMapSidePanelOpen, setIsMapSidePanelOpen] = React.useState(false);

  React.useEffect(() => {
    getBins();
  }, []);

  async function getBins() {
    const response = await get(BINS_ENDPOINT);
    setBins(response.bins);
    setHolidays(response.holidays);
    setOrders(response.orders);
  }

  async function createBin(foreignId, size, isActive) {
    setIsPending(true);

    try {
      const response = await post(BINS_ENDPOINT, {
        foreignId,
        size,
        isActive
      });

      setBins(response.bins);
      setError(null);
    } catch (errorMessage) {
      setError(errorMessage);
    }
    setIsPending(false);
  }

  async function saveBin(id, foreignId, size, isActive) {
    setIsPending(true);

    try {
      const response = await put(BINS_ENDPOINT, {
        id,
        foreignId,
        size,
        isActive
      });
      setBins(response.bins);
    } catch (errorMessage) {
      setError(errorMessage);
    }
    setIsPending(false);
  }

  function onClickSave(id, foreignId, size, isActive) {
    if (id) {
      saveBin(id, foreignId, size, isActive);
    } else {
      createBin(foreignId, size, isActive);
    }
  }

  async function onClickDelete(binId) {
    setIsPending(true);
    try {
      const response = await remove(BINS_ENDPOINT, { id: binId });
      setBins(response.bins);
    } catch (errorMessage) {
      setError(errorMessage);
    }
    setIsPending(false);
  }

  function onClearError() {
    setError(null);
  }

  const loggedInStaff = React.useContext(LoggedInStaffContext);
  if (!loggedInStaff) {
    return <Spinner />;
  }

  if (!loggedInStaff.pageAccess.manageBins) {
    return null;
  }

  const thingsToShare = {
    bins,
    holidays,
    orders,
    error,
    isPending,
    onClearError,
    onClickSave,
    onClickDelete,
    activeBin,
    setActiveBin,
    isSidePanelOpen,
    setIsSidePanelOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isMapSidePanelOpen,
    setIsMapSidePanelOpen
  };

  return (
    <BinsContext.Provider value={thingsToShare}>
      <Bins />
    </BinsContext.Provider>
  );
}
