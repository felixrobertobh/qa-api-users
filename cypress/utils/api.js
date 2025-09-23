export function authHeaders() {
    return { Authorization: Cypress.env('token') };
  }