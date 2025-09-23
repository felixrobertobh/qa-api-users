const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/results",
    overwrite: false,
    html: false,
    json: true
  },
  e2e: {
    baseUrl: "https://serverest.dev",
    env: {
      USERS_PATH: "/usuarios",
      LOGIN_PATH: "/login",
      RATE_LIMIT_PER_MIN: 100
    },
    setupNodeEvents(on, config) {
      // eventos podem ser adicionados aqui
    }
  }
});