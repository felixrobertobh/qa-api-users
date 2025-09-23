import { newUser } from '../utils/dataFactory';
import bad from '../fixtures/users.json';
import { authHeaders } from '../utils/api';

describe('Usuarios - Validações/Negativos', () => {
  const usersPath = Cypress.env('USERS_PATH');
  let existing;

  before(() => {
    cy.auth_createAdminAndLogin();
    // cria um usuário base para testar duplicidade
    const u = newUser();
    cy.request({ method: 'POST', url: usersPath, headers: authHeaders(), body: u })
      .then(res => {
        expect(res.status).to.eq(201);
        existing = { ...u, _id: res.body._id };
      });
  });

  it('Campos obrigatórios faltando', () => {
    ['nome', 'email', 'password', 'administrador'].forEach(field => {
      const u = newUser();
      delete u[field];
      cy.request({ method: 'POST', url: usersPath, headers: authHeaders(), body: u, failOnStatusCode: false })
        .its('status').should('be.oneOf', [400, 422]);
    });
  });

  it('Emails inválidos', () => {
    bad.invalidEmails.forEach(email => {
      cy.request({ method: 'POST', url: usersPath, headers: authHeaders(), body: newUser({ email }), failOnStatusCode: false })
        .its('status').should('be.oneOf', [400, 422]);
    });
  });

  it('Email duplicado', () => {
    cy.request({
      method: 'POST',
      url: usersPath,
      headers: authHeaders(),
      body: newUser({ email: existing.email }),
      failOnStatusCode: false
    }).its('status').should('be.oneOf', [400, 409]);
  });

  it('Campo "administrador" deve ser string "true" ou "false"', () => {
    const wrongTypes = [true, false, 1, 0, null];
    wrongTypes.forEach(val => {
      cy.request({
        method: 'POST',
        url: usersPath,
        headers: authHeaders(),
        body: newUser({ administrador: val }),
        failOnStatusCode: false
      }).its('status').should('be.oneOf', [400, 422]);
    });
  });

  it('Senhas fracas (ServeRest aceita → considerar limitação)', () => {
    bad.weakPasswords.forEach(pwd => {
      cy.request({
        method: 'POST',
        url: usersPath,
        headers: authHeaders(),
        body: newUser({ password: pwd }),
        failOnStatusCode: false
      }).its('status').should('be.oneOf', [201, 400, 422]);
    });
  });

  it('ID inexistente em GET/PUT/DELETE', () => {
    const ghost = '000000000000000000000000';
    cy.request({ method: 'GET', url: `${usersPath}/${ghost}`, headers: authHeaders(), failOnStatusCode: false })
      .its('status').should('be.oneOf', [400, 404]);
    cy.request({ method: 'PUT', url: `${usersPath}/${ghost}`, headers: authHeaders(), body: { nome: 'X' }, failOnStatusCode: false })
      .its('status').should('be.oneOf', [400, 404]);
    cy.request({ method: 'DELETE', url: `${usersPath}/${ghost}`, headers: authHeaders(), failOnStatusCode: false })
      .its('status').should('be.oneOf', [400, 404]);
  });
});