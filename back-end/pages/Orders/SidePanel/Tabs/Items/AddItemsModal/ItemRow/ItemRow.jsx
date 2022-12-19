import React from "react";
import PropTypes from "prop-types";
import IconButton from "Components/IconButton";
import { formatDollarAmount } from "Utils/library.jsx";
import "./ItemRow.scss";

function ItemRow({ availableItems, isDisabled, onChangeForm, onClickRemove, quantity, selectedItemId, unitPrice }) {
  return (
    <div className="item-row">
      <IconButton className="item-row__trash" isDisabled={isDisabled} onClick={onClickRemove} type="trash" />
      <input
        className="form-control item-row__quantity"
        disabled={isDisabled}
        name="quantity"
        onChange={onChangeForm}
        type="number"
        value={quantity}
      />
      <select
        className="form-control item-row__item"
        disabled={isDisabled}
        name="selectedItemId"
        onChange={onChangeForm}
        value={selectedItemId}
      >
        <option id="" value="" data-cost="0">
          - Choose an item -
        </option>
        {availableItems.map(item => (
          <option key={item.id} value={item.id} data-unit-price={item.unitPrice}>
            {item.name}
          </option>
        ))}
      </select>
      <div className="input-group item-row__unit-price">
        <div className="input-group-addon">$</div>
        <input
          className="form-control"
          disabled={isDisabled}
          name="unitPrice"
          type="number"
          onChange={onChangeForm}
          value={unitPrice}
        />
      </div>
      <div className="item-row__line-subtotal">{formatDollarAmount(quantity * unitPrice)}</div>
    </div>
  );
}

ItemRow.propTypes = {
  availableItems: PropTypes.array.isRequired,
  isDisabled: PropTypes.bool,
  onChangeForm: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  quantity: PropTypes.number,
  selectedItemId: PropTypes.number,
  unitPrice: PropTypes.number.isRequired
};

ItemRow.defaultProps = {
  isDisabled: false,
  quantity: 0,
  selectedItemId: 0
};

export default ItemRow;
