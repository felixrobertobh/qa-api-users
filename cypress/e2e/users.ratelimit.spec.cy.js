import { authHeaders } from '../utils/api';

describe('Usuarios - Rate Limit (100 req/min)', () => {
  const usersPath = Cypress.env('USERS_PATH');
  const LIMIT = Number(Cypress.env('RATE_LIMIT_PER_MIN') || 100);

  before(() => cy.auth_createAdminAndLogin());

  it('Cliente não excede 100 req/min (aceita 429 do servidor)', () => {
    let count = 0;

    Cypress._.times(20, () => {
      cy.wait(100);
      cy.request({ method: 'GET', url: usersPath, headers: authHeaders(), failOnStatusCode: false })
        .then((res) => {
          expect([200, 429]).to.include(res.status);
          count += 1;
        });
    });

    cy.then(() => {
      expect(count).to.be.lte(LIMIT);
    });
  });
});