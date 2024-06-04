require('dotenv').config();

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1100,
  watchForFileChanges: false,
  e2e: {
    baseUrl: process.env.BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
