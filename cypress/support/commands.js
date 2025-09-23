Cypress.Commands.add('auth_createAdminAndLogin', () => {
    const email = `admin_${Date.now()}@qa.com`;
    const payload = {
      nome: 'Admin QA',
      email,
      password: 'secret123',
      administrador: 'true'
    };
    const usersPath = Cypress.env('USERS_PATH');
    const loginPath = Cypress.env('LOGIN_PATH');
  
    // cria admin
    cy.request('POST', `${usersPath}`, payload).then((res) => {
      expect([201, 400]).to.include(res.status);
    });
  
    // login
    cy.request('POST', `${loginPath}`, { email: payload.email, password: payload.password })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('authorization');
        Cypress.env('token', res.body.authorization);
      });
  });
  
  Cypress.Commands.add('auth_headers', () => {
    return { Authorization: Cypress.env('token') };
  });