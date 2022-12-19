import {
  goToCreateOrderPage,
  loginToBackEnd,
  completeDateStep,
  completeServiceStep,
  completeInfoStep,
  completeCodeStepInBackEnd,
  enterValidCcInfo,
  setPaymentMethod
} from "Utils/cypress-helpers";

describe("Create Order", () => {
  context("Prevents skipping steps", () => {
    beforeEach(() => {
      cy.request("http://binbooker.test/cypress/init.php");
    });

    afterEach(() => {
      cy.request("http://binbooker.test/cypress/teardown.php");
    });

    it("should not let you skip to the 'service' step", () => {
      cy.visit("http://cypress.binbooker.test/service");
      cy.url().should("include", "code");
    });

    it("should not let you skip to the 'info' step", () => {
      cy.visit("http://cypress.binbooker.test/info");
      cy.url().should("include", "code");
    });

    it("should not let you skip to the 'review' step", () => {
      cy.visit("http://cypress.binbooker.test/review");
      cy.url().should("include", "code");
    });

    it("should not let you skip to the 'confirmation' step", () => {
      cy.visit("http://cypress.binbooker.test/confirmation");
      cy.url().should("include", "code");
    });
  });

  context("while in 'Test' Stripe mode", () => {
    beforeEach(() => {
      cy.request("http://binbooker.test/cypress/init.php");
      cy.request("http://binbooker.test/cypress/update/stripe-test-mode.php");
      loginToBackEnd(cy);
      goToCreateOrderPage(cy);
    });

    afterEach(() => {
      cy.request("http://binbooker.test/cypress/teardown.php");
    });

    it("shows warning message", () => {
      cy.get(".alert-warning").should("exist");
    });

    it("successfully creates order", () => {
      cy.server();
      cy.route("http://cypress.binbooker.test/api/v2/customers?email=john.doe@fake.com", {
        found: false
      });

      completeCodeStepInBackEnd(cy);
      completeDateStep(cy);
      completeServiceStep(cy);
      completeInfoStep(cy);
      enterValidCcInfo(cy);

      // cy.get("input[type='checkbox']").click();
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("not.exist");
      cy.url().should("include", "confirmation");
    });
  });

  context("while in 'Live' Stripe mode", () => {
    beforeEach(() => {
      cy.request("http://binbooker.test/cypress/init.php");
      loginToBackEnd(cy);
      // cy.visit("http://cypress.binbooker.test/back/create-order/code");
    });

    afterEach(() => {
      cy.request("http://binbooker.test/cypress/teardown.php");
    });

    it("does not show warning message when Stripe 'Live' mode is turned on", () => {
      goToCreateOrderPage(cy);
      cy.get(".alert-warning").should("not.exist");
    });

    // no need to test if it successfully creates an order, there are other tests for that in like Payment.cyp.js
  });

  context("no pick-up date", () => {
    beforeEach(() => {
      cy.request("http://binbooker.test/cypress/init.php");
      cy.request("http://binbooker.test/cypress/update/pickup-date-not-mandatory.php");
    });

    it("successfully creates order", () => {
      loginToBackEnd(cy);
      goToCreateOrderPage(cy);
      completeCodeStepInBackEnd(cy);

      // check the box that they only want to choose a drop-off date and pick one
      cy.get(".date__dont-choose-pick-up input").click();

      cy.get('.CalendarDay[aria-disabled="false"]')
        .first()
        .click();
      cy.get(".btn-primary").click();

      // create order
      completeServiceStep(cy);
      completeInfoStep(cy);
      setPaymentMethod(cy, "invoice");
      cy.get(".btn-primary").click();

      cy.url().should("include", "confirmation");
    });
  });
});
