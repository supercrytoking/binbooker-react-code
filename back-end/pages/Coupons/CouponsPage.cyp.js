import { loginToBackEnd } from "Utils/cypress-helpers";

const randomCouponCode = `xx${parseInt(Math.random() * 100000)}`;
const appendLetter = "bbbaaaccc";
const firstCouponSelector = ".coupons-page tbody tr:first-of-type td:first-of-type";

context("Coupons", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    loginToBackEnd(cy);

    cy.get(".link")
      .contains("Manage")
      .click();
    cy.get(".link")
      .contains("Coupons")
      .click();
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("should create coupon", () => {
    cy.get(".coupons-page .btn-default").click();
    cy.get("[name='code']").type(randomCouponCode);
    cy.get("[name='value']").type(123);
    cy.get(".jk-sidepanel .tab-pane.active .btn-primary").click();
    cy.get(".coupons__table").should("contain", randomCouponCode);
  });

  it("should update coupon", () => {
    cy.get(firstCouponSelector).click();
    cy.get("[name='code']").type(appendLetter);
    cy.get(".jk-sidepanel .tab-pane.active .btn-primary").click();
    cy.get(".coupons__table").should("contain", appendLetter);
  });

  it("should delete coupon", () => {
    cy.get(firstCouponSelector).click();
    cy.get(".jk-sidepanel .tab-pane.active .coupons-action-buttons .btn-default").click();
    cy.get(".modal-footer .btn-danger").click();
    cy.get(".modal-footer").should("not.exist"); //wait for modal to go away
    cy.get(".coupons__table").should("not.contain", "testCoupon");
  });
});
