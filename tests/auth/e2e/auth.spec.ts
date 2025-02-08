import { test, expect } from './setup'

test('Flux d\'authentification complet', async ({ page }) => {
  const testEmail = `test${Date.now()}@example.com`
  const testPassword = 'TestPassword123!'

  // 1. Inscription
  await test.step('Inscription', async () => {
    await page.goto('/')
    await page.click('[data-hs-overlay="#hs-toggle-between-modals-register-modal"]')
    
    await page.fill('#email', testEmail)
    await page.fill('#password', testPassword)
    await page.fill('#confirm-password', testPassword)
    await page.check('#accept-terms')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('#error-message')).toContainText('vérifier votre email')
  })

  // 2. Tentative d'inscription avec email existant
  await test.step('Email déjà utilisé', async () => {
    await page.goto('/')
    await page.click('[data-hs-overlay="#hs-toggle-between-modals-register-modal"]')
    
    await page.fill('#email', testEmail)
    await page.fill('#password', testPassword)
    await page.fill('#confirm-password', testPassword)
    await page.check('#accept-terms')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('#error-message')).toContainText('déjà utilisée')
  })

  // 3. Connexion
  await test.step('Connexion', async () => {
    await page.goto('/')
    await page.click('[data-hs-overlay="#hs-toggle-between-modals-login-modal"]')
    
    await page.fill('#login-email', testEmail)
    await page.fill('#password', testPassword)
    
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
  })

  // 4. Déconnexion
  await test.step('Déconnexion', async () => {
    await page.click('[data-logout-button]')
    await expect(page).toHaveURL('/')
  })

  // 5. Réinitialisation de mot de passe
  await test.step('Réinitialisation de mot de passe', async () => {
    await page.click('[data-hs-overlay="#hs-toggle-between-modals-recover-modal"]')
    await page.fill('#recover-email', testEmail)
    await page.click('button[type="submit"]')
    
    await expect(page.locator('#recover-email-error')).toContainText('vérifier votre email')
  })
}) 