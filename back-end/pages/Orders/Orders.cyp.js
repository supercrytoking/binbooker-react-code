import {
  loginToBackEnd,
  goToOrdersPage,
  setPaymentMethod,
  enterCcNumber,
  enterCcExpiry,
  enterCcCode
} from "Utils/cypress-helpers";

const fullyPaidIconSelector = ".orders__table tr td span[data-qa-id='not-fully-paid']";
const ellipsisButtonSelector = ".sidepanel__items-tab [data-qa-id='ellipsis-button']";

function loadNewestOrder() {
  cy.get(".orders__table tbody tr td.order__id").click();
}

function selectWeightItem() {
  cy.get('input[name="quantity"]').type("1.23");
  cy.get('select[name="selectedItemId"]').select("Weight");
}

function openAddItemsModal() {
  cy.get(".sidepanel__items-tab button")
    .contains("Add Item")
    .click();
}

function clickChargeButton() {
  cy.get(".modal-footer .pending-button").click();
}

function deleteLoadedOrder() {
  cy.get(ellipsisButtonSelector).click();

  cy.get("li")
    .contains("Delete Order")
    .click();

  cy.get("button")
    .contains("Delete Order")
    .click();
}

context("Orders", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    cy.request("http://binbooker.test/cypress/update/add-customer-with-existing-stripe-profile.php");
    cy.request("http://binbooker.test/cypress/update/create-invoiced-order.php");
    loginToBackEnd(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("lets me pay for an order that was invoiced", () => {
    goToOrdersPage(cy);

    cy.get(fullyPaidIconSelector).should("exist");

    loadNewestOrder();
    cy.get(ellipsisButtonSelector).click();

    cy.get("li")
      .contains("Pay Outstanding Amount")
      .click();

    cy.get("button")
      .contains("Submit Payment")
      .click();

    //close sidepanel (?)

    cy.get(fullyPaidIconSelector).should("not.exist");
  });

  // TODO: adding an item adds it to the list and the total updates

  it("lets me add an item to an order and pay via stripe", () => {
    goToOrdersPage(cy);
    loadNewestOrder();
    openAddItemsModal();
    selectWeightItem();
    clickChargeButton();

    cy.get(".orders__items .order-item:nth-of-type(3) td").should("contain", "Weight");
  });

  it("lets me add an item to an order and pay via new cc", () => {
    goToOrdersPage(cy);
    loadNewestOrder();
    openAddItemsModal();
    selectWeightItem();

    setPaymentMethod(cy, "credit-card");
    cy.wait(500);
    enterCcNumber(cy, "4242424242424242");
    enterCcExpiry(cy, "1234");
    enterCcCode(cy, "123");
    clickChargeButton();

    cy.get(".orders__items .order-item:nth-of-type(3) td").should("contain", "Weight");
  });

  it("lets me add an item to an order and pay via invoice", () => {
    goToOrdersPage(cy);
    loadNewestOrder();
    openAddItemsModal();
    selectWeightItem();

    setPaymentMethod(cy, "invoice");
    cy.wait(500);
    clickChargeButton();

    cy.get(".orders__items .order-item:nth-of-type(3) td").should("contain", "Weight");
  });

  it("lets me add an item to an order and pay via cash", () => {
    goToOrdersPage(cy);
    loadNewestOrder();
    openAddItemsModal();
    selectWeightItem();

    setPaymentMethod(cy, "cash");
    cy.wait(500);
    clickChargeButton();

    cy.get(".orders__items .order-item:nth-of-type(3) td").should("contain", "Weight");
  });

  it("removes a deleted order from the list", () => {
    goToOrdersPage(cy);
    loadNewestOrder();
    deleteLoadedOrder();
    cy.get("h4").should("contain", "No Orders");
  });

  xit("lets me upload, expand and delete attachments", () => {});
  xit("lets me use 'show unpaid only' filter", () => {});
});
