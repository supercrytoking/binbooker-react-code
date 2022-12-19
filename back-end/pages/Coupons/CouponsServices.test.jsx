import React from "react";
import Adapter from "enzyme-adapter-react-16";
import expect from "expect";
import { configure, shallow } from "enzyme";
import CouponsServices from "./CouponsServices";
import { Checkbox } from "react-bootstrap";

configure({ adapter: new Adapter() });

const props = {
  services: [
    {
      id: 1,
      title: "Service 1"
    },
    {
      id: 2,
      title: "Service 2"
    },
    {
      id: 3,
      title: "Service 3"
    },
    {
      id: 4,
      title: "Service 4"
    },
    {
      id: 5,
      title: "Service 5"
    }
  ],
  activeCoupon: {
    id: 1,
    code: "COUPON_CODE1",
    startDate: "2018-02-01",
    endDate: "2018-02-28",
    serviceIds: [1, 3, 4],
    value: 20,
    isPercent: false
  },
  setActiveCoupon: jest.fn()
};

describe("<CouponsServices />", () => {
  const wrapper = shallow(<CouponsServices {...props} />);

  it("lists all available services", () => {
    expect(wrapper.find(Checkbox).length).toEqual(props.services.length);
  });

  it("checked all the selected services", () => {
    props.services.map((service, index) => {
      if (
        props.activeCoupon.serviceIds.filter(serviceId => {
          return serviceId === service.id;
        }).length
      ) {
        expect(
          wrapper
            .find(Checkbox)
            .at(index)
            .props().checked
        ).toEqual(1);
      }
    });
  });
});
