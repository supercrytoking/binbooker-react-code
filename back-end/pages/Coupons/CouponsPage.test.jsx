import React from "react";
import Adapter from "enzyme-adapter-react-16";
import expect from "expect";
import { configure, shallow } from "enzyme";
import CouponsPage from "./Coupons";
import SidePanel from "Components/SidePanel/SidePanel";
import PendingButton from "Components/PendingButton/PendingButton";
import CouponsDetails from "./CouponsDetails";
import CouponsServices from "./CouponsServices";
import DeleteModal from "Components/DeleteModal";
import { Tabs, Tab } from "react-bootstrap";

configure({ adapter: new Adapter() });

const clearError = jest.fn();
const createCoupon = jest.fn();
const deleteCoupon = jest.fn();
const updateCoupon = jest.fn();

const props = {
  coupons: [
    {
      id: 1,
      code: "COUPON_CODE1",
      startDate: "2018-02-01",
      endDate: "2018-02-28",
      services: [
        {
          id: 1,
          name: "Service 1"
        },
        {
          id: 3,
          name: "Service 3"
        },
        {
          id: 4,
          name: "Service 4"
        }
      ],
      value: 20,
      isPercent: false
    },
    {
      id: 2,
      code: "COUPON_CODE2",
      startDate: "2018-02-01",
      endDate: "2018-02-07",
      services: [
        {
          id: 4,
          name: "Service 4"
        }
      ],
      value: 15,
      isPercent: true
    },
    {
      id: 3,
      code: "COUPON_CODE3",
      startDate: "2018-02-01",
      endDate: "2018-02-28",
      services: [
        {
          id: 1,
          name: "Service 1"
        },
        {
          id: 2,
          name: "Service 2"
        },
        {
          id: 3,
          name: "Service 3"
        },
        {
          id: 4,
          name: "Service 4"
        }
      ],
      value: 50.1,
      isPercent: false
    }
  ],
  clearError,
  createCoupon,
  deleteCoupon,
  isPending: false,
  services: [],
  updateCoupon
};

describe("<CouponsPage />", () => {
  const wrapper = shallow(<CouponsPage {...props} />);

  it("lists 3 coupons", () => {
    expect(wrapper.find("div.coupons-page tbody tr").length).toEqual(props.coupons.length);
  });

  describe("after clicking on 'create new coupon'", () => {
    it("open the sidepanel", () => {
      wrapper
        .find(".coupons-page")
        .find(PendingButton)
        .first()
        .simulate("click");
      expect(wrapper.find(SidePanel).props().open).toBeTruthy();
    });

    it("clicking the 'Details' tab shows that page", () => {
      wrapper
        .find(SidePanel)
        .find(Tabs)
        .find(Tab)
        .at(0)
        .simulate("click");
      expect(wrapper.find(SidePanel).find(CouponsDetails).length).toEqual(1);
    });

    it("clicking the 'Services' tab shows that page", () => {
      wrapper
        .find(SidePanel)
        .find(Tabs)
        .find(Tab)
        .at(1)
        .simulate("click");
      expect(
        wrapper
          .find(SidePanel)
          .find(Tabs)
          .find(Tab)
          .at(1)
          .find(CouponsServices).length
      ).toEqual(1);
    });

    it("render one button; Create", () => {
      expect(
        wrapper
          .find(SidePanel)
          .find(Tabs)
          .find(Tab)
          .at(1)
          .find(PendingButton).length
      ).toBe(1);
      expect(
        wrapper
          .find(SidePanel)
          .find(PendingButton)
          .first(0)
          .props().text
      ).toBe("Create");
    });

    describe("and clicking", () => {
      it("on 'create' button fires a callback", () => {
        wrapper
          .find(SidePanel)
          .find(Tabs)
          .find(Tab)
          .at(1)
          .find(PendingButton)
          .at(0)
          .simulate("click");
        expect(createCoupon).toHaveBeenCalled();
      });
    });
  });

  describe("after clicking on a coupon", () => {
    it("open the sidepanel", () => {
      wrapper
        .find("div.coupons-page tbody tr")
        .first()
        .simulate("click");
      expect(wrapper.find(SidePanel).props().open).toBeTruthy();
    });

    it("clicking the 'Details' tab shows that page", () => {
      wrapper
        .find(SidePanel)
        .find(Tabs)
        .find(Tab)
        .at(0)
        .simulate("click");
      expect(wrapper.find(SidePanel).find(CouponsDetails).length).toEqual(1);
    });

    it("clicking the 'Services' tab shows that page", () => {
      wrapper
        .find(SidePanel)
        .find(Tabs)
        .find(Tab)
        .at(1)
        .simulate("click");
      expect(wrapper.find(SidePanel).find(CouponsServices).length).toEqual(1);
    });

    it("render two buttons; Save and Delete", () => {
      expect(
        wrapper
          .find(SidePanel)
          .find(Tabs)
          .find(Tab)
          .first()
          .find(PendingButton).length
      ).toBe(2);
      expect(
        wrapper
          .find(SidePanel)
          .find(PendingButton)
          .at(0)
          .props().text
      ).toBe("Save");
      expect(
        wrapper
          .find(SidePanel)
          .find(PendingButton)
          .at(1)
          .props().text
      ).toBe("Delete");
    });

    describe("and clicking", () => {
      it("on 'save' button fires a callback", () => {
        wrapper
          .find(SidePanel)
          .find(Tabs)
          .find(Tab)
          .at(0)
          .find(PendingButton)
          .at(0)
          .simulate("click");
        expect(updateCoupon).toHaveBeenCalled();
      });

      it("on 'delete' button shows the delete modal", () => {
        wrapper
          .find(SidePanel)
          .find(PendingButton)
          .at(1)
          .simulate("click");
        expect(wrapper.find(DeleteModal).props().isVisible).toBeTruthy();
      });
    });
  });
});
