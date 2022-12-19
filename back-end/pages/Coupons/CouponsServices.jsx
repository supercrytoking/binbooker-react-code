import React from "react";
import { array, object, func } from "prop-types";
import { Checkbox } from "react-bootstrap";

export default function CouponsServices({ activeCoupon, services, setActiveCoupon }) {
  return (
    <React.Fragment>
      <p>Which services can this coupon be applied to?</p>
      {services.map((service, index) => {
        const serviceIsAlreadyActive =
          activeCoupon.serviceIds && activeCoupon.serviceIds.filter(_serviceId => _serviceId === service.id).length;

        return (
          <Checkbox
            key={index}
            name={service.title}
            id={service.title}
            checked={serviceIsAlreadyActive}
            onChange={() => {
              const _activeCoupon = Object.assign({}, activeCoupon);
              if (serviceIsAlreadyActive) {
                _activeCoupon.serviceIds = _activeCoupon.serviceIds.filter(_serviceId => _serviceId !== service.id);
              } else {
                _activeCoupon.serviceIds.push(service.id);
              }
              setActiveCoupon(_activeCoupon);
            }}
          >
            {service.title}
          </Checkbox>
        );
      })}
    </React.Fragment>
  );
}

CouponsServices.propTypes = {
  activeCoupon: object.isRequired,
  services: array.isRequired,
  setActiveCoupon: func.isRequired
};
