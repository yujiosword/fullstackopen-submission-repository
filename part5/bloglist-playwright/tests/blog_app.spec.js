const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('api/testing/reset')
    await request.post('api/users', {
      data: {
        name: 'kinkin',
        username: 'kinkin',
        password: '1234'
      }
  })
    await page.goto('/')
  })

  test('Login form is shown', async({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('kinkin')
      await page.getByLabel('password').fill('1234')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('kinkin logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('kin')
      await page.getByLabel('password').fill('1234')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('kin logged in')).not.toBeVisible()
    })
  })
})
