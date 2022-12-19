import React from "react";
import { get, put } from "Utils/services.jsx";
import SpinnerCentred from "Components/Spinner/SpinnerCentred";
import ConnectButton from "./ConnectButton";
import DisconnectButton from "./DisconnectButton";
import FetchItemsButton from "./FetchItemsButton";
import ToggleSwitch from "Components/ToggleSwitch";
import "./QuickBooks.scss";

export default function QuickBooks({ qbAccessToken, qbIsSyncing }) {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(qbAccessToken !== "" && qbAccessToken !== null);
  const [isSyncing, setIsSyncing] = React.useState(qbIsSyncing);
  const [isSaving, setIsSaving] = React.useState(false);

  const validSubdomains = [
    "sample.binbooker.test",
    "demo.binbooker.com",
    "ladybinsllc.binbooker.com",
    "purgedumpsters.binbooker.com",
    "tigerbins.binbooker.com",
    "torcontractingbins.binbooker.com",
    "trashoutexpress.binbooker.com"
  ];

  if (validSubdomains.indexOf(window.location.hostname) === -1) {
    return (
      <>
        <p>
          It is now possible for BinBooker to send transaction and customer data to QuickBooks Online automatically,
          saving time and reducing errors.
        </p>
        <p>
          This new feature is currently only available upon request. Please{" "}
          <a href="mailto:info@binbooker.com?Subject=QuickBooks" target="_blank" rel="noopener noreferrer">
            email us
          </a>{" "}
          if you are interested in learning more.
        </p>
      </>
    );
  }

  async function connectToQuickBooks() {
    const authUrl = await get("/api/v2/quickbooks/get-auth-url");
    window.open(authUrl);
    setIsConnecting(true);
  }

  async function toggleQuickBooksSyncing() {
    setIsSaving(true);
    const newValue = !isSyncing;

    await put("/api/v2/quickbooks/set-issyncing", { value: +newValue });

    setIsSyncing(newValue);
    setIsSaving(false);
  }

  if (isConnected) {
    return (
      <>
        <div className="quickbooks-toggle-wrapper">
          <ToggleSwitch
            isChecked={isSyncing}
            isDisabled={isSaving}
            id="sync-quickbooks"
            isSmall
            name="Sync QuickBooks"
            onChange={toggleQuickBooksSyncing}
          />
          {isSyncing ? (
            <span>
              Transaction and customer data is automatically being sent to QuickBooks Online in real-time. Toggle this
              button to stop sending transaction and customer data to QuickBooks Online.
            </span>
          ) : (
            <span>
              BinBooker is linked to QuickBooks Online, but not enabled. Toggle this button to enable sending
              transaction and customer data to QuickBooks Online in real-time.
            </span>
          )}
        </div>
        <FetchItemsButton />
        <br />
        <br />
        <DisconnectButton setIsConnected={setIsConnected} />
      </>
    );
  }

  if (isConnecting) {
    return (
      <>
        <SpinnerCentred />
        <br />
        <p>
          A new window should have opened where you can login to QuickBooks and complete this connection. Once done,
          that window should close automatically, then you can refresh this page.
        </p>
      </>
    );
  }

  return (
    <>
      <p>
        By enabling this feature BinBooker will automatically copy transaction and customer data into QuickBooks Online.
      </p>
      <ConnectButton connectToQuickBooks={connectToQuickBooks} />
    </>
  );
}
