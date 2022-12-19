import React from "react";
import PendingButton from "Components/PendingButton/PendingButton";
import { get } from "Utils/services.jsx";

export default function DisconnectButton({ setIsConnected }) {
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  return (
    <PendingButton
      disabled={isDisconnecting}
      pending={isDisconnecting}
      onClick={async () => {
        if (
          confirm(
            "Are you sure you want to disconnect? This will not delete any data, it will simply stop BinBooker from sending order information to QuickBooks Online."
          )
        ) {
          setIsDisconnecting(true);
          const success = await get("/api/v2/quickbooks/disconnect");
          if (success) {
            setIsDisconnecting(false);
            setIsConnected(false);
          }
        }
      }}
      text="Disconnect BinBooker from QuickBooks Online"
      pendingText="Disconnecting BinBooker from QuickBooks Online..."
      bsStyle="danger"
    />
  );
}
