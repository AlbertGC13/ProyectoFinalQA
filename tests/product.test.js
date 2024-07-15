// tests/product.test.js
const { test, expect } = require('@playwright/test');

test('test product creation', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Add steps to create a product and verify it
});
