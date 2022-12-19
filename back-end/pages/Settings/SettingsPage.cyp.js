import { loginToBackEnd, goToSettingsPage } from "Utils/cypress-helpers";

context("Settings", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    loginToBackEnd(cy);
    goToSettingsPage(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("shows content on 'Company details' tab", () => {
    cy.get("#settingsTab-tab-CompanyDetails").click();
    cy.get(".tab-pane.active #companyName").should("have.length", 1);
  });

  it("shows content on 'Billing' tab", () => {
    cy.get("#settingsTab-tab-Billing").click();
    cy.get("label[for='currency']").contains("Currency*");
  });

  it("shows content on 'Scheduling' tab", () => {
    cy.get("#settingsTab-tab-Scheduling").click();
    cy.get(".tab-pane.active #maxJobsMonday").should("have.length", 1);
  });

  it("shows content on 'Content' tab", () => {
    cy.get("#settingsTab-tab-Content").click();
    cy.get(".tab-pane.active .quill").should("have.length", 7);
  });

  it("shows proper fields to canadians", () => {
    cy.get("#settingsTab-tab-CompanyDetails").click();
    cy.get("label[for='postalCode']").contains("Postal code");
  });

  // it("shows proper fields to americans", () => {});

  it("throws errors when required fields are left blank", () => {
    cy.get(".alert-danger").should("have.length", 0);
    cy.get("#settingsTab-tab-CompanyDetails").click();
    cy.get("#companyName").clear();
    cy.get("#settingsTab-pane-CompanyDetails .btn-primary").click();
    cy.get(".alert-danger").should("have.length", 1);
  });

  it("saves what i entered", () => {
    const randomString = Math.random()
      .toString(36)
      .slice(-5);
    const newUrl = `http://www.${randomString}.com`;

    cy.get("#url")
      .clear()
      .type(newUrl);

    cy.get("button")
      .contains("Save")
      .click();

    cy.reload();

    cy.get("#url").should("have.value", newUrl);
  });
});
