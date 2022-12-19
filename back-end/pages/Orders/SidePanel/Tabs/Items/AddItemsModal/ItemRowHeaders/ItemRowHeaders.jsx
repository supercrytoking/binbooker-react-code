import React from "react";
import "../ItemRow/ItemRow.scss";
import "./ItemRowHeaders.scss";

export default function ItemRowHeaders() {
  return (
    <div className="item-row item-row--headers">
      <div className="item-row__trash" />
      <div className="item-row__quantity">Quantity</div>
      <div className="item-row__item">Item</div>
      <div className="item-row__unit-price">Unit Price</div>
      <div className="item-row__line-subtotal">Total</div>
    </div>
  );
}
