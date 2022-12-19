const strongPassword = "supercalafrajalisticexpialadocious";
const weakPassword = "hi";

function setPassword(value) {
  cy.get("#new-password").type(value);
}

function setConfirmPassword(value) {
  cy.get("#confirm-password").type(value);
}

function disabledButtonShould(exitOrNot) {
  cy.get("button[disabled]").should(exitOrNot);
}

context("ResetPasswordPage", () => {
  beforeEach(() => {
    cy.visit("http://sample.binbooker.test/back/reset-password");
  });

  it("should disable 'submit' when passwords are empty", () => {
    disabledButtonShould("exist");
  });

  it("should disable 'submit' when passwords are strong but dont match", () => {
    setPassword(strongPassword);
    setConfirmPassword(`${strongPassword}xxxx`);
    disabledButtonShould("exist");
    cy.get("span")
      .contains("Passwords do not match.")
      .should("exist");
  });

  it("should disable 'submit' when password is weak", () => {
    setPassword(weakPassword);
    disabledButtonShould("exist");
    cy.get("span")
      .contains("This password is not strong enough.")
      .should("exist");
  });

  it("should enable 'submit' when passwords are strong and match", () => {
    setPassword(strongPassword);
    setConfirmPassword(strongPassword);
    disabledButtonShould("not.exist");
  });
});
