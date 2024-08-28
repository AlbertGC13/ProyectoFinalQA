const { test, expect } = require('@playwright/test');

test('Create a new product with invalid data', async ({ page }) => {
    // Navegar a la página de creación de nuevo producto
    await page.goto('http://localhost:3001/app/products/new-product');
  
    // Llenar el formulario de nuevo producto con datos inválidos
    await page.fill('#name', 'Producto123');
    await page.fill('#description', '');
    await page.selectOption('#category', '');
    await page.fill('#price', '-100');
    await page.fill('#quantity', '-10');
    await page.click('button[type="submit"]');
  
    // Verificar que aparecen los mensajes de error
    await expect(page.locator('text=Nombre debe ser solo letras y espacios.')).toBeVisible();
    await expect(page.locator('text=Descripción es requerida.')).toBeVisible();
    await expect(page.locator('text=Categoría es requerida.')).toBeVisible();
    await expect(page.locator('text=Precio debe ser un número positivo.')).toBeVisible();
    await expect(page.locator('text=Cantidad debe ser un número entero positivo.')).toBeVisible();
  });
  