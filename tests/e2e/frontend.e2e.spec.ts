import { test, expect } from '@playwright/test'

test.describe('Frontend golden path', () => {
  test('homepage loads and navigates to a section', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/.+/)

    await page.getByRole('link', { name: 'News' }).first().click()
    await expect(page).toHaveURL(/\/news/)
  })

  test('articles listing links through to an article detail page', async ({ page }) => {
    await page.goto('/articles')

    const articleLink = page.locator('a[href^="/articles/"]').first()
    test.skip((await articleLink.count()) === 0, 'no seeded articles to link to')

    await articleLink.click()
    await expect(page).toHaveURL(/\/articles\/.+/)
  })

  test('search returns results for a known term', async ({ page }) => {
    await page.goto('/search?q=a')

    const resultLink = page.locator('article a[href^="/articles/"]').first()
    test.skip((await resultLink.count()) === 0, 'no seeded articles to search')

    await expect(resultLink).toBeVisible()
  })
})
