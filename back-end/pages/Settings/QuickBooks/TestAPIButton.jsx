import React from "react";
import { get } from "Utils/services.jsx";

export default function TestAPIButton() {
  return (
    <button
      className="btn btn-default"
      type="button"
      onClick={async () => {
        const response = await get("/api/v2/quickbooks/test-api");
        alert(response);
      }}
    >
      Test QuickBooks Online connection
    </button>
  );
}
