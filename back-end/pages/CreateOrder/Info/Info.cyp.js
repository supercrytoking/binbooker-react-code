import {
  completeCodeStep,
  completeDateStep,
  completeServiceStep,
  fillInBillingInfo,
  completeInfoStep,
  loadUser,
  loginToBackEnd,
  completeCodeStepInBackEnd,
  goToCreateOrderPage
} from "Utils/cypress-helpers";

context("Info - Generic", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    cy.visit("http://cypress.binbooker.test/code");

    completeCodeStep(cy);
    completeDateStep(cy);
    completeServiceStep(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("should not have an error message by default", () => {
    cy.get(".alert-danger").should("not.exist");
  });

  it("shows error if they dont enter all mandatory fields", () => {
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("exist");
  });

  it("shows an error when delivery address is different and left blank", () => {
    cy.get("input[type='checkbox']").click(); // deselect "delivery address is the same as billing address"
    fillInBillingInfo(cy);
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("exist");
  });

  it("does not show an error and proceeds to the next step when delivery address is different and mandatory delivery fields are populated", () => {
    cy.get("input[type='checkbox']").click();
    fillInBillingInfo(cy);
    cy.get("[name='deliveryStreet1']").type("222 Fake Street");
    cy.get("[name='deliveryCity']").type("Burnaby");
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("not.exist");
    cy.url().should("include", "review");
  });

  it("does not show error when they enter all mandatory fields and proceeds to next step", () => {
    completeInfoStep(cy);
    cy.get(".alert-danger").should("not.exist");
  });
});

context("Info - Back-end", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    cy.request("http://binbooker.test/cypress/update/add-customer-with-existing-stripe-profile.php");

    loginToBackEnd(cy);
    goToCreateOrderPage(cy);
    completeCodeStepInBackEnd(cy);
    completeDateStep(cy);
    completeServiceStep(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("searches for and loads a user", () => {
    loadUser(cy);
    cy.get("[name='lastName']").should("have.value", "Test");
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("not.exist");
    cy.url().should("include", "review");
  });

  it("unloads a user", () => {
    loadUser(cy);
    cy.get("a")
      .contains("Unload Customer")
      .click();

    cy.get("[name='lastName']").should("not.have.value", "Test");
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("exist");
  });

  it("checks 'addressIsSame' if the customer has ordered for themself before", () => {
    cy.request("http://binbooker.test/cypress/update/add-customer-who-has-ordered-for-self-before.php");

    // load a customer who has ordered before for themself
    cy.get(".filter input").type("cypress.test.ordered.before@fake.com");
    cy.get(".create-order__search-results tr").click();

    // "delivery address is the same" should be checked
    cy.get("input[type='checkbox']").should("be.checked");

    // it should allow going to next step
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("not.exist");
    cy.url().should("include", "review");
  });

  it("does not check 'addressIsSame' if the customer has ordered for someone else before", () => {
    cy.request("http://binbooker.test/cypress/update/add-customer-who-has-ordered-for-different-address-before.php");

    // load a customer who has ordered before for a different address
    cy.get(".filter input").type("cypress.test.contractor@fake.com");
    cy.get(".create-order__search-results tr").click();

    // "delivery address is the same" should NOT be checked
    cy.get("input[type='checkbox']").should("not.be.checked");

    // it should show error if try and go to next step
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("exist");
  });
});
