import { loginToBackEnd } from "Utils/cypress-helpers";

const randomHolidayName = `my new holiday ${parseInt(Math.random() * 100000)}`;
const appendLetter = "b";

context("Holidays", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    loginToBackEnd(cy);

    cy.get(".link")
      .contains("Manage")
      .click();
    cy.get(".link")
      .contains("Holidays")
      .click();
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("should add, update and delete holiday", () => {
    cy.get(".bubbly button").click();
    cy.get("[name='holiday-name']").type(randomHolidayName);
    cy.get(".jk-sidepanel .btn-primary").click();
    cy.get(".holidays__table").should("contain", randomHolidayName);

    cy.contains(randomHolidayName).click();
    cy.get("[name='holiday-name']").type(appendLetter);
    cy.get(".jk-sidepanel .btn-primary").click();
    cy.get(".holidays__table").should("contain", `${randomHolidayName}${appendLetter}`);

    cy.contains(`${randomHolidayName}${appendLetter}`).click();
    cy.get(".jk-sidepanel .btn-default").click();
    cy.get(".modal-footer .btn-danger").click();
    cy.get(".modal-footer").should("not.exist"); //wait for modal to go away
    cy.get(".holidays__table").should("not.contain", `${randomHolidayName}${appendLetter}`);
  });
});
