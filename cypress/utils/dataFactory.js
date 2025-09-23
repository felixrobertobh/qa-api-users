export function newUser(overrides = {}) {
    const rand = Math.random().toString(16).slice(2);
    return {
      nome: `QA User ${rand}`,
      email: `qa_user_${Date.now()}_${rand}@mail.com`,
      password: 'pwd12345',
      administrador: 'false',
      ...overrides
    };
  }