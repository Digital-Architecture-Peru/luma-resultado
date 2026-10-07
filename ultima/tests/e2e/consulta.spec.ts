import { test, expect } from '@playwright/test'

// Plantilla E2E: requiere `npm run dev` en http://localhost:5173 (no ejecutada aqui).
test('consulta de tarjetas: seleccionar tarjeta muestra movimientos', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await expect(page.getByRole('heading', { name: 'Consulta de tarjetas' })).toBeVisible()
  await page.getByRole('button', { name: /Compras diarias/ }).click()
  await expect(page.getByRole('table')).toBeVisible()
  await expect(page.getByText('•••• 1234').first()).toBeVisible()
})
