import {
  completeCodeStep,
  completeDateStep,
  completeServiceStep,
  loginToBackEnd,
  goToCreateOrderPage,
  completeCodeStepInBackEnd,
  completeInfoStep
} from "Utils/cypress-helpers";

context("Service - Front end", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    cy.visit("http://cypress.binbooker.test/code");

    completeCodeStep(cy);
    completeDateStep(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("should not have an error message by default", () => {
    cy.get(".alert-danger").should("not.exist");
  });

  it("shows error if they dont choose a service", () => {
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("exist");
  });

  it("does not show error when they choose a service and proceeds to next step", () => {
    completeServiceStep(cy);
    cy.get(".alert-danger").should("not.exist");
  });

  it("does not show the 'bin selector' dropdown from the front-end", () => {
    // choose a service
    cy.get(".service--enabled")
      .eq(0)
      .click();

    cy.get("select").should("not.exist");
  });
});

context("Service - Back end", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    loginToBackEnd(cy);
    goToCreateOrderPage(cy);
    completeCodeStepInBackEnd(cy);
    completeDateStep(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("they could choose a bin", () => {
    // choose a service
    cy.get(".service--enabled")
      .eq(0)
      .click();

    cy.get("select").should("exist");

    // choose a bin
    cy.get(".service--enabled .service--bin-selector select").select("1501");
    cy.get(".btn-primary").click();

    completeInfoStep(cy);
    cy.contains("1501").should("be.visible");
  });
});
