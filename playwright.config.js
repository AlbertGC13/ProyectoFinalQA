const { defineConfig, devices } = require('@playwright/test');

module.exports = {
    testDir: './tests/e2e',
    use: {
      headless: false,
      baseURL: 'http://localhost:3001',
      actionTimeout: 10000,
      navigationTimeout: 30000,
      slowMo: 50000,
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
      {
        name: 'Mobile Chrome',
        use: {
          ...devices['Pixel 5'],
        },
      },
      {
        name: 'Mobile Safari',
        use: {
          ...devices['iPhone 12'],
        },
      },
    ],
  };