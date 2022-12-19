import { goToBinsPage, loginToBackEnd } from "Utils/cypress-helpers";

const randomBinId = `CypressTestBin-${parseInt(Math.random() * 10000)}`;
const binSize = "98";
const newBinId = `${randomBinId}-mod`;
const newBinSize = "99";

const createNewBinButtonSelector = ".bins-container__add-button .btn-default";
const saveButtonSelector = ".btn__save .btn-primary";
const deleteButtonSelector = ".btn__save .btn-default";
const lastBinRowSelector = ".bins-container tbody tr:last-of-type";

function createBin(cy) {
  cy.get(createNewBinButtonSelector).click();
  cy.get('input[name="bin-id"]').type(randomBinId);
  cy.get('input[name="bin-size"]').type(binSize);
  cy.get(saveButtonSelector).click();
}

function deleteBin(cy) {
  cy.get(lastBinRowSelector).click();
  cy.get(deleteButtonSelector).click();
  cy.get(".modal-footer .btn-danger").click();
}

context("Bins", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
    loginToBackEnd(cy);
    goToBinsPage(cy);
    cy.get(".Spinner").should("not.be.visible");
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  it("lets me create a bin and lists bins", () => {
    cy.get(lastBinRowSelector).should("not.contain", randomBinId);
    cy.get(lastBinRowSelector).should("not.contain", newBinId);
    createBin(cy);
    cy.get(lastBinRowSelector).should("contain", randomBinId);
    cy.get(lastBinRowSelector).should("contain", binSize);
    cy.get(lastBinRowSelector).should("contain", "Yes"); // "Is Active"
  });

  it("lets me update a bin (change all fields)", () => {
    cy.get(lastBinRowSelector).click();
    cy.get('input[name="bin-id"]')
      .clear()
      .type(newBinId);
    cy.get('input[name="bin-size"]')
      .clear()
      .type(newBinSize);
    cy.get('input[name="bin-is-active"]').click();
    cy.get(saveButtonSelector).click();

    cy.get(lastBinRowSelector).should("contain", newBinId);
    cy.get(lastBinRowSelector).should("contain", newBinSize);
    cy.get(lastBinRowSelector).should("contain", "No"); // "Is Active"
  });

  it("lets me delete a bin", () => {
    deleteBin(cy);
    cy.get(lastBinRowSelector).should("not.contain", randomBinId);
  });

  it("prevents me from creating a bin with an id that is already used", () => {
    cy.get(".alert-danger").should("not.exist");
    createBin(cy);
    createBin(cy);
    cy.get(".alert-danger").should("exist");
    // clean up
    cy.get(".alert-danger button").click();
    cy.get(".jk-sidepanel .ant-drawer-header button").click();
    deleteBin(cy);
  });
});
