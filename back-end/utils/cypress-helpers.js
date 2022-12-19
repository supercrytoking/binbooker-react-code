export function goToBackEnd(cy) {
  cy.visit("http://cypress.binbooker.test/back/login");
}

export function loginToBackEnd(cy) {
  goToBackEnd(cy);
  cy.get("#username").type("demo");
  cy.get("#password").type("demo");
  cy.get(".btn-primary").click();
}

export function loginToBackEndAsDriver(cy) {
  goToBackEnd(cy);
  cy.get("#username").type("driver@sampledisposal.com");
  cy.get("#password").type("demo");
  cy.get(".btn-primary").click();
}

export function logout(cy) {
  cy.get("a")
    .contains("Logout")
    .click();
}

export function submitPostalCode(cy, postalCode) {
  postalCode = postalCode.replace(" ", "");
  cy.get("input:nth-of-type(1)").type(postalCode.substr(0, 1));
  cy.get("input:nth-of-type(2)").type(postalCode.substr(1, 1));
  cy.get("input:nth-of-type(3)").type(postalCode.substr(2, 1));
  cy.get("input:nth-of-type(4)").type(postalCode.substr(3, 1));
  cy.get("input:nth-of-type(5)").type(postalCode.substr(4, 1));
  cy.get("input:nth-of-type(6)").type(postalCode.substr(5, 1));
  cy.get(".btn-primary").click();
}

export function completeCodeStep(cy) {
  cy.get("input:nth-of-type(1)").type("A");
  cy.get("input:nth-of-type(2)").type("1");
  cy.get("input:nth-of-type(3)").type("A");
  cy.get("input:nth-of-type(4)").type("1");
  cy.get("input:nth-of-type(5)").type("A");
  cy.get("input:nth-of-type(6)").type("1");
  cy.get(".btn-primary").click();
  cy.url().should("include", "date");
}

export function completeCodeStepInBackEnd(cy) {
  cy.get("input:nth-of-type(1)").type("A");
  cy.get("input:nth-of-type(2)").type("1");
  cy.get("input:nth-of-type(3)").type("A");
  cy.get("input:nth-of-type(4)").type("1");
  cy.get("input:nth-of-type(5)").type("A");
  cy.get("input:nth-of-type(6)").type("1");
  cy.get(".btn-primary").click();
  cy.url().should("include", "date");
}

export function completeDateStep(cy) {
  cy.get('.CalendarMonthGrid_month__horizontal:nth-of-type(2) .CalendarMonth .CalendarDay[aria-disabled="false"]')
    .eq(0)
    .click();
  cy.get('.CalendarMonthGrid_month__horizontal:nth-of-type(2) .CalendarMonth .CalendarDay[aria-disabled="false"]')
    .eq(1)
    .click();
  cy.get(".btn-primary").click();
  cy.url().should("include", "service");
}

export function completeServiceStep(cy) {
  cy.get(".service--enabled")
    .eq(0)
    .click();
  cy.get(".btn-primary").click();
  cy.url().should("include", "info");
}

export function fillInBillingInfo(cy) {
  cy.get("[name='firstName']").type("John");
  cy.get("[name='lastName']").type("Doe");
  cy.get("[name='billingStreet1']").type("123 Fake Street");
  cy.get("[name='billingCity']").type("Vancouver");
  cy.get("[name='phone']").type("604-111-2222");
  cy.get("[name='email']").type(`john.doe@fake.com`);
}

export function completeInfoStep(cy) {
  fillInBillingInfo(cy);
  cy.get(".btn-primary").click();
  cy.url().should("include", "review");
  cy.wait(500); // for Stripe to load
}

export function loadUser(cy) {
  cy.get(".filter input").type("cypress.test@fake.com");
  cy.get(".create-order__search-results tr").click();
}

export function completeInfoStepByLoadingUser(cy) {
  loadUser(cy);
  cy.get(".btn-primary").click();
  cy.url().should("include", "review");
  cy.wait(500); // for Stripe to load
}

export function goToCreateOrderPage(cy) {
  cy.get(".link")
    .contains("Create new Order")
    .click();
}

export function goToOrdersPage(cy) {
  cy.get(".link")
    .contains("Orders")
    .click();
}

export function goToTrucksSchedulePage(cy) {
  cy.get(".link")
    .contains("Truck's Schedule")
    .click();
}

function expandManageSublinks(cy) {
  if (document.querySelectorAll(".link.sublink.link--hidden").length === 0) {
    cy.get(".link")
      .contains("Manage")
      .click();
  }
}

export function goToBinsPage(cy) {
  expandManageSublinks(cy);

  cy.get(".link")
    .contains("Bins")
    .click();
}

export function goToServicesPage(cy) {
  expandManageSublinks(cy);

  cy.get(".link")
    .contains("Services")
    .click();
}

export function goToSettingsPage(cy) {
  expandManageSublinks(cy);

  cy.get(".link")
    .contains("Settings")
    .click();
}

export function goToZonePage(cy) {
  expandManageSublinks(cy);

  cy.get(".link")
    .contains("Zone")
    .click();
}

export function setPaymentMethod(cy, value) {
  cy.get('select[name="paymentMethod"]').select(value);
}

export function enterCcNumber(cy, value) {
  cy.get(".__PrivateStripeElement:eq(0) > iframe").then($element => {
    const $body = $element.contents().find("body");

    let stripe = cy.wrap($body);
    stripe
      .find('input[name="cardnumber"]')
      .eq(0)
      .click()
      .type(value);
  });
}

export function enterCcExpiry(cy, value) {
  cy.get(".__PrivateStripeElement:eq(1) > iframe").then($element => {
    const $body = $element.contents().find("body");

    let stripe = cy.wrap($body);
    stripe
      .find("input[name='exp-date']")
      .eq(0)
      .click()
      .type(value);
  });
}

export function enterCcCode(cy, value) {
  cy.get(".__PrivateStripeElement:eq(2) > iframe").then($element => {
    const $body = $element.contents().find("body");

    let stripe = cy.wrap($body);
    stripe
      .find("input[name='cvc']")
      .eq(0)
      .click()
      .type(value);
  });
}

export function enterInvalidCcInfo(cy) {
  enterCcNumber(cy, "4343434343434343");
  enterCcExpiry(cy, "0125");
  enterCcCode(cy, "123");
}

export function enterValidCcInfo(cy) {
  enterCcNumber(cy, "4242424242424242");
  enterCcExpiry(cy, "0125");
  enterCcCode(cy, "123");
}

export function enterFailingCcInfo(cy) {
  enterCcNumber(cy, "4000000000000002");
  enterCcExpiry(cy, "0125");
  enterCcCode(cy, "123");
}

export function errorShouldAppear(cy) {
  cy.get(".alert-danger").should("exist");
}

export function errorShouldNotAppear(cy) {
  cy.get(".alert-danger").should("not.exist");
}
