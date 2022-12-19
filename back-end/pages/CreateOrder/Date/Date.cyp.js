import { completeCodeStep, completeDateStep } from "Utils/cypress-helpers";

context("Date", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    cy.visit("http://cypress.binbooker.test/code");

    completeCodeStep(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("does not show an error by default", () => {
    cy.get(".alert-danger").should("not.exist");
  });

  it('shows error if they dont choose 2 dates (and didnt select "Do not choose a pick-up date")', () => {
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("exist");
  });

  it('does not show an error if they selected "Do not choose a pick-up date" and chose a date', () => {
    cy.get('input[type="checkbox"]').click(); // check 'only choose one date'

    cy.get('.CalendarDay[aria-disabled="false"]')
      .first()
      .click();
    cy.get(".btn-primary").click();
    cy.url().should("include", "service");

    cy.get(".alert-danger").should("not.exist");
  });

  it("does not show error when enter valid data and proceeds to next step", () => {
    completeDateStep(cy);
    cy.get(".alert-danger").should("not.exist");
  });

  it("should take you to 'code' step if press browsers 'back' button", () => {
    cy.go("back");
    cy.url().should("include", "code");
  });
});
