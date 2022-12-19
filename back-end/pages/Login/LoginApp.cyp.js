import { goToBackEnd } from "Utils/cypress-helpers";

context("LoginApp", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    goToBackEnd(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("should show error on failed login", () => {
    cy.get(".alert-danger").should("not.exist");
    cy.get("#username").type("asdfasdf");
    cy.get("#password").type("asdfasdf");
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("exist");
  });

  it("should log you in on successful login", () => {
    const originalUrl = cy.url();
    cy.get(".alert-danger").should("not.exist");
    cy.get("#username").type("demo");
    cy.get("#password").type("demo");
    cy.get(".btn-primary").click();
    cy.get(".alert-danger").should("not.exist");
    cy.url().should("not.equal", originalUrl);
  });
});
