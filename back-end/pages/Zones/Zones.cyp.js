import {
  loginToBackEnd,
  goToCreateOrderPage,
  submitPostalCode,
  errorShouldAppear,
  errorShouldNotAppear,
  goToZonePage,
  completeDateStep
} from "Utils/cypress-helpers";

const randomZoneName = `Cypress Zone${parseInt(Math.random() * 100000)}`;
const servicePrice = "500";

context("Zones", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    cy.request("http://binbooker.test/cypress/update/delete-zones.php");
    loginToBackEnd(cy);
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  function createNewZone(postalCode) {
    cy.get(".bubbly button").click();
    cy.get("[name='name']").type(randomZoneName);
    cy.get("textarea").type(postalCode);
    cy.get(".jk-sidepanel .btn-primary").click();
  }

  function setPostalCode(postalCode) {
    cy.get("textarea")
      .clear()
      .type(postalCode);
    cy.get(".jk-sidepanel .btn-primary").click();
  }

  function servicePriceShouldBeCorrect() {
    cy.get(".service").should("contain", servicePrice);
  }

  function enableZoneAndSetPriceForService() {
    // wait for spinner to go away
    cy.get(".Spinner").should("not.be.visible");

    cy.get(".services-page table tbody tr:first-of-type").click();
    cy.get("#servicesTab-tab-pricing").click();

    cy.get("#servicesTab-pane-pricing .toggle-switch").click();
    cy.get("#servicesTab-pane-pricing input[type='text']")
      .clear()
      .type(servicePrice);
    cy.get("#servicesTab-pane-pricing > .services__action-buttons > .pending-button").click();
  }

  function deleteZone() {
    cy.contains(randomZoneName).click();
    cy.get(".jk-sidepanel .btn-default").click();
    cy.get(".modal-footer .btn-danger").click();
    cy.get(".modal-footer").should("not.exist"); //wait for modal to go away
    cy.get("table").should("not.contain", randomZoneName);
  }

  // covers: ordering process doesnt allow unsupported postal codes
  // covers: ordering process does allow supported postal codes
  // covers: creating zone
  // covers: setting invalid postal code for zone
  // covers: setting valid postal code for zone
  // covers: enabling service in zone
  // covers: listing service for zone and showing proper price
  // covers: deleting zone
  it("should allow setting a valid postal code, and support it", () => {
    goToCreateOrderPage(cy);
    submitPostalCode(cy, "Z1Z 1Z1");
    errorShouldAppear(cy);

    goToZonePage(cy);
    createNewZone("Z1Z1Z1");
    errorShouldAppear(cy);
    setPostalCode("Z1Z 1Z1");
    errorShouldNotAppear(cy);

    goToCreateOrderPage(cy);
    submitPostalCode(cy, "Z1Z 1Z1");
    errorShouldAppear(cy);

    // goToServicesPage(cy); // not working since menu already expanded
    cy.get(".link")
      .contains("Services")
      .click();

    enableZoneAndSetPriceForService();

    goToCreateOrderPage(cy);
    submitPostalCode(cy, "Z1Z 1Z1");
    completeDateStep(cy);
    servicePriceShouldBeCorrect();

    // goToZonePage(cy);
    cy.get(".link")
      .contains("Zone")
      .click();

    deleteZone();
  });
});
