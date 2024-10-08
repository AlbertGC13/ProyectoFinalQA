const { test, expect } = require('@playwright/test');
const { injectAxe, checkA11y } = require('@axe-core/playwright');


test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de inicio de sesión
    await page.goto('http://localhost:3001');

    // Esperar a que el campo de entrada de nombre de usuario esté visible
    await page.waitForSelector('input[name="user"]', { timeout: 10000 });

    // Llenar el formulario de inicio de sesión
    await page.fill('input[name="user"]', 'admin');
    await page.fill('input[name="password"]', 'admin');
    await page.click('button[type="submit"]');

    await page.waitForURL('http://localhost:3001/app/dashboard');

    // Esperar a que la página de inicio de sesión redirija a la página de productos
    await page.goto('http://localhost:3001/app/products');
  });

  test('Create a new product', async ({ page }) => {
    // Navegar a la página de creación de nuevo producto
    await page.goto('http://localhost:3001/app/products/new-product');

    // Llenar el formulario de nuevo producto
    await page.fill('#name', 'Producto de Ejemplo 2');
    await page.fill('#description', 'Descripción del producto');
    await page.selectOption('#category', 'Electronico');
    await page.fill('#price', '100');
    await page.fill('#quantity', '10');
    await page.click('button[type="submit"]');

    await page.waitForURL('http://localhost:3001/app/products');

  });

  test('Delete a product', async ({ page }) => {

    await page.click('button[id="deleteProduct"]');
    await page.click('button[id="confirmDelete"]');
  });

});

test.describe('Accesibilidad de la página de productos', () => {
  test('La página de productos debe ser accesible', async ({ page }) => {
    await page.goto('http://localhost:3001/app/products');
    await injectAxe(page);
    await checkA11y(page, null, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
    });
  });
});
