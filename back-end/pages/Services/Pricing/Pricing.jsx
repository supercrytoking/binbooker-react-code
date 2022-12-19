import React from "react";
import PropTypes from "prop-types";
import { FormGroup, InputGroup, FormControl } from "react-bootstrap";
import ServicesContext from "../ServicesContext.jsx";
import ToggleSwitch from "Components/ToggleSwitch";
import "./Pricing.scss";

export default function Pricing({ isSaving }) {
  const { activeService, updateZoneIsActive, updateZonePrice } = React.useContext(ServicesContext);
  const { zones } = activeService;

  return (
    <div className="services__pricing">
      {zones.map(zone => (
        <div className="zone" key={`zone-${zone.id}`}>
          <div className="zone__toggle-wrapper">
            <ToggleSwitch
              isSmall
              isDisabled={isSaving}
              id={`zone-${zone.id}`}
              name={`zone-${zone.id}`}
              onChange={() => {
                updateZoneIsActive(zone.id, !zone.isActive);
              }}
              isChecked={zone.isActive}
            />
          </div>
          <div className="zone__name">{zone.name}</div>
          <div className="zone__price">
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className="bg-dark">$</InputGroup.Addon>
                <FormControl
                  className="text-input"
                  type="text"
                  disabled={!zone.isActive || isSaving}
                  value={zone.rentalPrice}
                  onChange={e => {
                    updateZonePrice(zone.id, e.target.value);
                  }}
                />
              </InputGroup>
            </FormGroup>
          </div>
        </div>
      ))}
    </div>
  );
}

Pricing.propTypes = {
  isSaving: PropTypes.bool.isRequired
};
