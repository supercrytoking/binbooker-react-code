import React from "react";
import { bool, object, func } from "prop-types";
import { Button, ButtonGroup, FormControl, FormGroup, InputGroup } from "react-bootstrap";
import SingleDatePickerRow from "Components/SingleDatePickerRow";

export default function CouponsDetails({
  activeCoupon,
  handleChangeDate,
  isValidFromPickerOpen,
  isValidUntilPickerOpen,
  setActiveCoupon,
  setIsValidFromPickerOpen,
  setIsValidUntilPickerOpen
}) {
  function renderTextInput(type, name, label, value, onChangeFunction, isPercent) {
    return (
      <FormGroup>
        <label htmlFor={name}>{label}</label>
        {name === "value" ? (
          <InputGroup>
            {!isPercent && <InputGroup.Addon>$</InputGroup.Addon>}
            <FormControl type={type} id={name} name={name} defaultValue={value} onChange={onChangeFunction} />
            {isPercent && <InputGroup.Addon>%</InputGroup.Addon>}
          </InputGroup>
        ) : (
          <FormControl type={type} id={name} name={name} defaultValue={value} onChange={onChangeFunction} />
        )}
      </FormGroup>
    );
  }

  function renderIsPercentRadioInput() {
    return (
      <FormGroup>
        <div>
          <label>Dollars or Percentage* </label>
        </div>
        <ButtonGroup className="coupons__isPercent">
          <Button
            className={`${activeCoupon.isPercent ? "" : "active"}`}
            onClick={() => {
              const _activeCoupon = Object.assign({}, activeCoupon);
              _activeCoupon.isPercent = false;
              setActiveCoupon(_activeCoupon);
            }}
          >
            $
          </Button>
          <Button
            className={`${activeCoupon.isPercent ? "active" : ""}`}
            onClick={() => {
              const _activeCoupon = Object.assign({}, activeCoupon);
              _activeCoupon.isPercent = true;
              setActiveCoupon(_activeCoupon);
            }}
          >
            %
          </Button>
        </ButtonGroup>
      </FormGroup>
    );
  }

  return (
    <React.Fragment>
      {renderTextInput("text", "code", "Coupon Code*", activeCoupon.code, e => {
        const _activeCoupon = Object.assign({}, activeCoupon);
        _activeCoupon.code = e.target.value;
        setActiveCoupon(_activeCoupon);
      })}
      <SingleDatePickerRow
        date={activeCoupon.validFrom}
        hasFocus={isValidFromPickerOpen}
        isDayBlocked={() => false}
        label="Valid From*"
        onDateChange={date => handleChangeDate("validFrom", date)}
        onFocusChange={({ focused }) => setIsValidFromPickerOpen(focused)}
      />
      <SingleDatePickerRow
        date={activeCoupon.validUntil}
        hasFocus={isValidUntilPickerOpen}
        isDayBlocked={() => false}
        label="Valid Until*"
        onDateChange={date => handleChangeDate("validUntil", date)}
        onFocusChange={({ focused }) => setIsValidUntilPickerOpen(focused)}
      />
      {renderIsPercentRadioInput()}
      {renderTextInput(
        "number",
        "value",
        "Value*",
        activeCoupon.value,
        e => {
          const _activeCoupon = Object.assign({}, activeCoupon);
          _activeCoupon.value = parseFloat(e.target.value);
          setActiveCoupon(_activeCoupon);
        },
        activeCoupon.isPercent
      )}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          className="form-control"
          name="description"
          rows="3"
          value={activeCoupon.description}
          onChange={e => {
            const _activeCoupon = Object.assign({}, activeCoupon);
            _activeCoupon.description = e.target.value;
            setActiveCoupon(_activeCoupon);
          }}
        />
      </div>
    </React.Fragment>
  );
}

CouponsDetails.propTypes = {
  activeCoupon: object.isRequired,
  handleChangeDate: func.isRequired,
  isValidFromPickerOpen: bool.isRequired,
  isValidUntilPickerOpen: bool.isRequired,
  setActiveCoupon: func.isRequired,
  setIsValidFromPickerOpen: func.isRequired,
  setIsValidUntilPickerOpen: func.isRequired
};
