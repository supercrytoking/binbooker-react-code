import React from "react";
import { shallow } from "enzyme";
import PaymentMethodFormSection from "./index";
import { PAYMENT_METHODS } from "Utils/constants.jsx";

describe("<PaymentMethodFormSection />", () => {
  const props = {
    onChange: () => {},
    onChangePoNumber: () => {},
    paymentMethod: PAYMENT_METHODS.invoice,
    allowStripe: true,
    allowInvoice: true,
    allowPreAuth: true,
    isDisabled: false
  };

  describe("PO Number prompt", () => {
    const poNumberSelector = 'input[name="poNumber"]';

    it("shows when payment method is invoice and in back-end", () => {
      const wrapper = shallow(<PaymentMethodFormSection {...props} />);
      expect(wrapper.find(poNumberSelector).length).toEqual(1);
    });

    it("does not show when payment method is not invoice", () => {
      const wrapperStripe = shallow(<PaymentMethodFormSection {...props} paymentMethod={PAYMENT_METHODS.stripe} />);

      const wrapperCc = shallow(<PaymentMethodFormSection {...props} paymentMethod={PAYMENT_METHODS.creditCard} />);

      const wrapperCash = shallow(<PaymentMethodFormSection {...props} paymentMethod={PAYMENT_METHODS.cash} />);

      expect(wrapperStripe.find(poNumberSelector).length).toEqual(0);
      expect(wrapperCc.find(poNumberSelector).length).toEqual(0);
      expect(wrapperCash.find(poNumberSelector).length).toEqual(0);
    });

    it("does not show when not in back-end", () => {
      const wrapper = shallow(<PaymentMethodFormSection {...props} allowInvoice={false} />);
      expect(wrapper.find(poNumberSelector).length).toEqual(0);
    });
  });

  describe("Pre-Auth", () => {
    const preAuthOptionSelector = 'option[value="pre-auth"]';

    it("shows when told to", () => {
      const wrapper = shallow(<PaymentMethodFormSection {...props} />);
      expect(wrapper.find(preAuthOptionSelector).length).toEqual(1);
    });

    it("does not show when not told to", () => {
      const wrapper = shallow(<PaymentMethodFormSection {...props} allowPreAuth={false} />);
      expect(wrapper.find(preAuthOptionSelector).length).toEqual(0);
    });
  });
});
