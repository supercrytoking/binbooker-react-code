describe("Code", () => {
  beforeEach(() => {
    cy.request("http://binbooker.test/cypress/init.php");
  });

  afterEach(() => {
    cy.request("http://binbooker.test/cypress/teardown.php");
  });

  describe("Generic", () => {
    beforeEach(() => {
      cy.visit("http://cypress.binbooker.test/code");
    });

    it("should not have an error message by default", () => {
      cy.get(".alert-danger").should("not.exist");
    });

    it("shows error when dont enter postal/zip code", () => {
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("exist");
    });
  });

  describe("Canadians", () => {
    beforeEach(() => {
      cy.visit("http://cypress.binbooker.test/code");
    });

    it("shows error when enter invalid postal code", () => {
      cy.get("input:nth-of-type(1)").type("9");
      cy.get("input:nth-of-type(2)").type("9");
      cy.get("input:nth-of-type(3)").type("9");
      cy.get("input:nth-of-type(4)").type("9");
      cy.get("input:nth-of-type(5)").type("9");
      cy.get("input:nth-of-type(6)").type("9");
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("exist");
    });

    it("shows error when enter postal code outside of service area", () => {
      cy.get("input:nth-of-type(1)").type("Z");
      cy.get("input:nth-of-type(2)").type("1");
      cy.get("input:nth-of-type(3)").type("Z");
      cy.get("input:nth-of-type(4)").type("1");
      cy.get("input:nth-of-type(5)").type("Z");
      cy.get("input:nth-of-type(6)").type("1");
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("exist");
    });

    it("does not show error when enter a valid postal code and proceeds to next step", () => {
      cy.get("input:nth-of-type(1)").type("A");
      cy.get("input:nth-of-type(2)").type("1");
      cy.get("input:nth-of-type(3)").type("A");
      cy.get("input:nth-of-type(4)").type("1");
      cy.get("input:nth-of-type(5)").type("A");
      cy.get("input:nth-of-type(6)").type("1");
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("not.exist");
      cy.url().should("include", "date");
    });
  });

  describe("Americans", () => {
    beforeEach(() => {
      cy.request("http://binbooker.test/cypress/update/usa.php");
      cy.visit("http://cypress.binbooker.test/code");
    });

    it("shows error when enter invalid zip code", () => {
      cy.get("input:nth-of-type(1)").type("A");
      cy.get("input:nth-of-type(2)").type("1");
      cy.get("input:nth-of-type(3)").type("A");
      cy.get("input:nth-of-type(4)").type("1");
      cy.get("input:nth-of-type(5)").type("A");
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("exist");
    });

    it("shows error when enter postal code outside of service area", () => {
      cy.get("input:nth-of-type(1)").type("9");
      cy.get("input:nth-of-type(2)").type("0");
      cy.get("input:nth-of-type(3)").type("2");
      cy.get("input:nth-of-type(4)").type("1");
      cy.get("input:nth-of-type(5)").type("1");
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("exist");
    });

    it("does not show error when enter a valid zip code and proceeds to next step", () => {
      cy.get("input:nth-of-type(1)").type("9");
      cy.get("input:nth-of-type(2)").type("0");
      cy.get("input:nth-of-type(3)").type("2");
      cy.get("input:nth-of-type(4)").type("1");
      cy.get("input:nth-of-type(5)").type("0");
      cy.get(".btn-primary").click();
      cy.get(".alert-danger").should("not.exist");
      cy.url().should("include", "date");
    });
  });
});
