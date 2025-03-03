import { test, expect } from '@playwright/test'

test('Flux d\'authentification complet', async ({ page }) => {
  const testEmail = `test${Date.now()}@example.com`
  const testPassword = 'TestPassword123!'

  // Accéder à la page d'inscription
  await page.goto('/auth/register')
  await page.waitForLoadState('networkidle')

  // Remplir le formulaire d'inscription
  await page.fill('input[name="email"]', testEmail)
  await page.fill('input[name="password"]', testPassword)
  await page.click('button[type="submit"]')

  // Vérifier la redirection vers la page de connexion
  await expect(page).toHaveURL('/auth/signin')

  // Remplir le formulaire de connexion
  await page.fill('input[name="email"]', testEmail)
  await page.fill('input[name="password"]', testPassword)
  await page.click('button[type="submit"]')

  // Vérifier la redirection vers le tableau de bord
  await expect(page).toHaveURL('/dashboard')

  // Vérifier que l'utilisateur est connecté
  await expect(page.locator('text=Dashboard')).toBeVisible()
}) 