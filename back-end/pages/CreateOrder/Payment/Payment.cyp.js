import {
  completeCodeStep,
  completeDateStep,
  completeServiceStep,
  completeInfoStep,
  completeInfoStepByLoadingUser,
  loginToBackEnd,
  goToCreateOrderPage,
  completeCodeStepInBackEnd,
  setPaymentMethod,
  enterValidCcInfo,
  enterInvalidCcInfo,
  enterFailingCcInfo
} from "Utils/cypress-helpers";

context("Payment", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  context("Generic", () => {
    beforeEach(() => {
      cy.visit("http://cypress.binbooker.test/code");

      completeCodeStep(cy);
      completeDateStep(cy);
      completeServiceStep(cy);
      completeInfoStep(cy);
    });

    it("should not have an error message by default", () => {
      cy.get(".alert-danger").should("not.exist");
    });

    it("shows error when missing cc info", () => {
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("exist");
    });

    it("shows error when invalid cc info", () => {
      enterInvalidCcInfo(cy);

      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("exist");
    });

    it("shows error when valid cc info, but card declined", () => {
      enterFailingCcInfo(cy);
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("exist");
    });

    xit("shows error when stripe is down", () => {});

    it("should work with a valid coupon code", () => {
      cy.get('[data-qa-id="expand-coupon-prompt"]').click();
      cy.get("[name='couponCode']").type("testCoupon");
      cy.get(".btn-default").click();
      cy.get('[data-qa-id="coupon-value"]').should("have.text", "-$10.00");

      cy.get("[name='poNumber']").should("not.exist");

      enterValidCcInfo(cy);
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("not.exist");
      cy.url().should("include", "confirmation");
    });

    it("should work with an invalid coupon code", () => {
      cy.get('[data-qa-id="expand-coupon-prompt"]').click();
      cy.get("[name='couponCode']").type("not-a-real-coupon-code");
      cy.get(".btn-default").click();
      cy.get('[data-qa-id="coupon-value"]').should("not.exist");

      enterValidCcInfo(cy);
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("not.exist");
      cy.url().should("include", "confirmation");
    });
  });

  context("Front-end", () => {
    context("With T&C", () => {
      beforeEach(() => {
        cy.request("http://binbooker.test/cypress/update/add-terms-and-conditions.php");
        cy.visit("http://cypress.binbooker.test/code");

        completeCodeStep(cy);
        completeDateStep(cy);
        completeServiceStep(cy);
        completeInfoStep(cy);
      });

      it("they must agree to T&C before submitting order", () => {
        enterValidCcInfo(cy);

        cy.get(".btn-primary").click();
        cy.get(".alert-danger").should("exist");
        cy.url().should("include", "review");

        cy.get("input[type='checkbox']").click();
        cy.get(".btn-primary").click();
        cy.get(".alert-danger").should("not.exist");
        cy.url().should("include", "confirmation");
      });
    });

    context("Without T&C", () => {
      beforeEach(() => {
        cy.visit("http://cypress.binbooker.test/code");

        completeCodeStep(cy);
        completeDateStep(cy);
        completeServiceStep(cy);
        completeInfoStep(cy);
        enterValidCcInfo(cy);
      });

      it("when there are no terms and conditions, it proceeds to the next step", () => {
        cy.get(".btn-primary").click();
        cy.get(".alert-danger").should("not.exist");
        cy.url().should("include", "confirmation");
      });
    });

    context("Default payment method", () => {
      context("Invoice", () => {
        beforeEach(() => {
          cy.request("http://binbooker.test/cypress/update/invoice-from-front-end.php");
          cy.visit("http://cypress.binbooker.test/code");

          completeCodeStep(cy);
          completeDateStep(cy);
          completeServiceStep(cy);
          completeInfoStep(cy);
        });

        it("should not prompt for payment and should successfully create the order", () => {
          cy.get(".credit-card-fields").should("not.exist");

          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });
      });

      context("Pre-auth", () => {
        beforeEach(() => {
          cy.request("http://binbooker.test/cypress/update/set-default-payment-method-preauth.php");
          cy.visit("http://cypress.binbooker.test/code");

          completeCodeStep(cy);
          completeDateStep(cy);
          completeServiceStep(cy);
          completeInfoStep(cy);
        });

        it("should prompt for payment and should successfully create the order", () => {
          enterValidCcInfo(cy);

          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });
      });
    });
  });

  context("Back-end", () => {
    context("Default payment method 'credit-card'", () => {
      context("Existing customer", () => {
        beforeEach(() => {
          cy.request("http://binbooker.test/cypress/update/add-customer-with-existing-stripe-profile.php");

          loginToBackEnd(cy);
          goToCreateOrderPage(cy);
          completeCodeStepInBackEnd(cy);
          completeDateStep(cy);
          completeServiceStep(cy);
          completeInfoStepByLoadingUser(cy);
        });

        it("should work when choose a coupon", () => {
          cy.get('[data-qa-id="expand-coupon-prompt"]').click();
          cy.get(".coupon-code__select").select("testCoupon");
          cy.get('[data-qa-id="coupon-value"]').should("not.have.text", "-$0.00");

          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });

        it("paying by 'stripe' (existing card)", () => {
          setPaymentMethod(cy, "stripe");
          cy.get("[name='poNumber']").should("not.exist");
          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });

        it("paying by 'cash'", () => {
          setPaymentMethod(cy, "cash");
          cy.get("[name='poNumber']").should("not.exist");
          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });

        it("paying by 'invoice'", () => {
          setPaymentMethod(cy, "invoice");
          cy.get("[name='poNumber']").should("exist");
          cy.get("[name='poNumber']").type("test-po-123");
          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });

        it("paying by 'credit-card' (new card)", () => {
          setPaymentMethod(cy, "credit-card");
          cy.get("[name='poNumber']").should("not.exist");

          cy.wait(500);

          enterValidCcInfo(cy);

          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });

        it("there should be no option to pay by 'pre-auth'", () => {
          cy.get('[name="paymentMethod"] option').each($option => {
            cy.get($option).should("not.have.value", "pre-auth");
          });

          setPaymentMethod(cy, "invoice");

          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });
      });

      context("New customer", () => {
        beforeEach(() => {
          loginToBackEnd(cy);
          goToCreateOrderPage(cy);
          completeCodeStepInBackEnd(cy);
          completeDateStep(cy);
          completeServiceStep(cy);
          completeInfoStep(cy);
        });

        it("there should be an option to pay by 'pre-auth'", () => {
          setPaymentMethod(cy, "pre-auth");
        });
      });
    });

    context("Default payment method 'pre-auth'", () => {
      context("New customer", () => {
        beforeEach(() => {
          cy.request("http://binbooker.test/cypress/update/set-default-payment-method-preauth.php");

          loginToBackEnd(cy);
          goToCreateOrderPage(cy);
          completeCodeStepInBackEnd(cy);
          completeDateStep(cy);
          completeServiceStep(cy);
          completeInfoStep(cy);
        });

        it("there should be an option to pay by 'pre-auth'", () => {
          cy.get('[name="paymentMethod"]').should("have.value", "pre-auth");

          enterValidCcInfo(cy);

          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });
      });

      context("Existing customer", () => {
        beforeEach(() => {
          cy.request("http://binbooker.test/cypress/update/set-default-payment-method-preauth.php");
          cy.request("http://binbooker.test/cypress/update/add-customer-with-existing-stripe-profile.php");

          loginToBackEnd(cy);
          goToCreateOrderPage(cy);
          completeCodeStepInBackEnd(cy);
          completeDateStep(cy);
          completeServiceStep(cy);
          completeInfoStepByLoadingUser(cy);
        });

        it("there should not be an option to pay by 'pre-auth', it should default to 'invoice'", () => {
          cy.get('[name="paymentMethod"] option').each($option => {
            cy.get($option).should("not.have.value", "pre-auth");
          });

          cy.get('[name="paymentMethod"]').should("have.value", "invoice");

          cy.get(".btn-primary").click();
          cy.get(".alert-danger").should("not.exist");
          cy.url().should("include", "confirmation");
        });
      });
    });
  });
});
