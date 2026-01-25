import { test as base } from '@playwright/test'

// Configuration personnalisée pour les tests e2e
export const test = base.extend({
  // Configuration de la page avant chaque test
  page: async ({ page }, use) => {
    // Configuration de base
    await page.setViewportSize({ width: 1280, height: 720 })

    // Utilisation de la page configurée
    await use(page)
  },
})

export { expect } from '@playwright/test' 