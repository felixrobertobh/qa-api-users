describe('Auth - JWT', () => {
    it('Cria admin e obtém token de autorização', () => {
      cy.auth_createAdminAndLogin();
      cy.then(() => {
        expect(Cypress.env('token')).to.be.a('string').and.not.be.empty;
      });
    });
  });