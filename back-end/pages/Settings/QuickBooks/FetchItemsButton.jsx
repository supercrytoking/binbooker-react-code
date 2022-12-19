import React from "react";
import { get } from "Utils/services.jsx";

export default function FetchItemsButton() {
  return (
    <button
      className="btn btn-default"
      type="button"
      onClick={async () => {
        await get("/api/v2/quickbooks/fetch-items");
        // Look in the Network tab to see what was returned
      }}
    >
      Fetch Items
    </button>
  );
}
