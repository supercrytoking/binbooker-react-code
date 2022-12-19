import React from "react";
import Icon from "../Icon";
import "./Button.scss";

export default function Button({ onClick }) {
  return (
    <button className="quickbooks-button" onClick={onClick}>
      <Icon />
      Connect to QuickBooks Online
    </button>
  );
}
