context("ForgotPasswordPage", () => {
  beforeEach(() => {
    cy.visit("http://sample.binbooker.test/back/forgot-password");
  });

  xit("should show 'error' if dont enter email", () => {
    // it actually doesnt do this... make it do this
  });

  it("should show 'success' screen after submit", () => {
    cy.get("input").type("fake@fake.com");
    cy.get("button")
      .contains("Send link")
      .click();
    cy.get("h1")
      .contains("Sent!")
      .should("exist");
  });
});
