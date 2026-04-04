const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./test/e2e",
  retries: 1,
  use: {
    baseURL: "http://127.0.0.1:8080",
    headless: true,
  },
  webServer: {
    command: "npm run web:start",
    port: 8080,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
