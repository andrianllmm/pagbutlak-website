import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

test.describe('Accessibility (axe)', () => {
  // Next dev cold-compiles each route on first visit, which can take well
  // over the default 30s navigation timeout the first time a route is hit.
  test.setTimeout(90_000)

  test('homepage has no automatically detectable violations', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

    expect(results.violations).toEqual([])
  })

  test('a section listing page has no automatically detectable violations', async ({ page }) => {
    await page.goto('/news')

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

    expect(results.violations).toEqual([])
  })

  test('an article detail page has no automatically detectable violations', async ({ page }) => {
    await page.goto('/articles')

    const articleLink = page.locator('a[href^="/articles/"]').first()
    test.skip((await articleLink.count()) === 0, 'no seeded articles to check')

    await articleLink.click()

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

    expect(results.violations).toEqual([])
  })

  test('an author detail page has no automatically detectable violations', async ({ page }) => {
    await page.goto('/authors')

    const authorLink = page.locator('a[href^="/authors/"]').first()
    test.skip((await authorLink.count()) === 0, 'no seeded authors to check')

    await authorLink.click()

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

    expect(results.violations).toEqual([])
  })

  test('a multimedia detail page has no automatically detectable violations', async ({ page }) => {
    await page.goto('/multimedia')

    const multimediaLink = page.locator('a[href^="/multimedia/"]').first()
    test.skip((await multimediaLink.count()) === 0, 'no seeded multimedia to check')

    await multimediaLink.click()

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

    expect(results.violations).toEqual([])
  })

  test('search results have no automatically detectable violations', async ({ page }) => {
    await page.goto('/search?q=a')

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

    expect(results.violations).toEqual([])
  })

  test('the admin login page has no automatically detectable violations', async ({ page }) => {
    await page.goto('/admin/login')

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

    expect(results.violations).toEqual([])
  })
})
