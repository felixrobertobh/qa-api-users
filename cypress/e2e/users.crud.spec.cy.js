import { newUser } from '../utils/dataFactory';
import { authHeaders } from '../utils/api';

describe('Usuarios - CRUD', () => {
  let createdId;
  const usersPath = Cypress.env('USERS_PATH');

  before(() => cy.auth_createAdminAndLogin());

  it('Cria usuário', () => {
    cy.request({
      method: 'POST',
      url: `${usersPath}`,
      headers: authHeaders(),
      body: newUser()
    }).then((res) => {
      expect(res.status).to.eq(201);
      createdId = res.body._id;
    });
  });

  it('Lista inclui o criado', () => {
    cy.request({ method: 'GET', url: `${usersPath}`, headers: authHeaders() })
      .its('body.usuarios')
      .should(list => {
        expect(list.find(u => u._id === createdId)).to.exist;
      });
  });

  it('Detalha por ID', () => {
    cy.request({ method: 'GET', url: `${usersPath}/${createdId}`, headers: authHeaders() })
      .its('body')
      .should('include', { _id: createdId });
  });

  it('Atualiza usuário', () => {
    cy.request({
      method: 'PUT',
      url: `${usersPath}/${createdId}`,
      headers: authHeaders(),
      body: { nome: 'QA Updated', administrador: 'true' }
    }).its('status').should('be.oneOf', [200, 201]);
  });

  it('Deleta usuário', () => {
    cy.request({ method: 'DELETE', url: `${usersPath}/${createdId}`, headers: authHeaders() })
      .its('status').should('be.oneOf', [200, 204]);
  });

  it('Detalhe após delete → 400/404', () => {
    cy.request({
      method: 'GET',
      url: `${usersPath}/${createdId}`,
      headers: authHeaders(),
      failOnStatusCode: false
    }).its('status').should('be.oneOf', [400, 404]);
  });
});