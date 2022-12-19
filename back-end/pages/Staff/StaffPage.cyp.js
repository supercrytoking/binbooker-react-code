import { loginToBackEnd, logout } from "Utils/cypress-helpers";

function loginToBackEndAsDriver() {
  cy.visit("http://cypress.binbooker.test/back/login");

  cy.get("#username").type("driver@sampledisposal.com");
  cy.get("#password").type("demo");
  cy.get(".btn-primary").click();
}

function pageShouldLoad(url) {
  cy.visit(`http://cypress.binbooker.test${url}`);
  cy.get("main").should("not.be.empty");
}

function pageShouldNotLoad(url) {
  cy.visit(`http://cypress.binbooker.test${url}`);
  cy.get("main").should("be.empty");
}

context("Staff", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  // TODO: can create staff
  // TODO: can update staff (details and page access)
  // TODO: can delete staff

  it("admin only sees page they have access to in nav", () => {
    loginToBackEnd(cy);
    cy.get("div.link").click(); //expand nav

    cy.get('[href="/back/schedule"]').should("exist");
    cy.get('[href="/back/orders"]').should("exist");
    cy.get('[href="/back/create-order/code"]').should("exist");
    cy.get('[href="/back/customers"]').should("exist");
    cy.get('[href="/back/truck-schedule"]').should("not.exist");
    cy.get('[href="/back/bins"]').should("exist");
    cy.get('[href="/back/coupons"]').should("exist");
    cy.get('[href="/back/items"]').should("exist");
    cy.get('[href="/back/services"]').should("exist");
    cy.get('[href="/back/settings"]').should("exist");
    cy.get('[href="/back/staff"]').should("exist");
    cy.get('[href="/back/zones"]').should("exist");
    cy.get('[href="/back/logout"]').should("exist");
    logout(cy);
  });

  it("admin sees pages they have access to", () => {
    loginToBackEnd(cy);
    pageShouldLoad("/back/schedule");
    pageShouldLoad("/back/orders");
    pageShouldLoad("/back/create-order/code");
    pageShouldLoad("/back/customers");
    pageShouldNotLoad("/back/truck-schedule");
    pageShouldLoad("/back/bins");
    pageShouldLoad("/back/coupons");
    pageShouldLoad("/back/items");
    pageShouldLoad("/back/services");
    pageShouldLoad("/back/settings");
    pageShouldLoad("/back/staff");
    pageShouldLoad("/back/zones");
  });

  it("driver only sees page they have access to in nav", () => {
    loginToBackEndAsDriver();
    cy.get('[href="/back/schedule"]').should("not.exist");
    cy.get('[href="/back/orders"]').should("not.exist");
    cy.get('[href="/back/create-order/code"]').should("not.exist");
    cy.get('[href="/back/customers"]').should("not.exist");
    cy.get('[href="/back/truck-schedule"]').should("exist");
    cy.get('[href="/back/logout"]').should("exist");
    logout(cy);
  });

  // this logic is correct but something is wrong with cypress, it is cancelling XHR requests that check to see if user is logged in, and test fails
  it("driver does not see pages they do not have access to", () => {
    loginToBackEndAsDriver();
    pageShouldNotLoad("/back/schedule");
    pageShouldNotLoad("/back/orders");
    pageShouldNotLoad("/back/create-order/code");
    pageShouldNotLoad("/back/customers");
    pageShouldLoad("/back/truck-schedule");
    pageShouldNotLoad("/back/bins");
    pageShouldNotLoad("/back/coupons");
    pageShouldNotLoad("/back/items");
    pageShouldNotLoad("/back/services");
    pageShouldNotLoad("/back/settings");
    pageShouldNotLoad("/back/staff");
    pageShouldNotLoad("/back/zones");
    logout(cy);
  });

  xit("completes a job in both calendars when a driver clicks on it", () => {
    //how does the job get into today's calendar??? if use cypress stubs, that doesn't prove that it works... need to create the order (or hit a url)
    // loginToBackEnd(cy);
    // //job X should be incomplete
    // logout(cy);
    // loginToBackEndAsDriver();
    // //job X should be incomplete
    // //click on job X
    // //job X should be complete
    // logout(cy);
    // loginToBackEnd(cy);
    // //job X should be complete
    // logout(cy);
  });
});
