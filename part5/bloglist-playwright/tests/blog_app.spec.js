const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
      await loginWith(page, 'kinkin', '1234')
      await expect(page.getByText('kinkin logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'kin', '1234')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('kin logged in')).not.toBeVisible()
    })
  })
  
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'kinkin', '1234')
    })

    test('a new blog can be created', async ({ page}) => {
      await createBlog(page, 'book title', 'book author', 'book url')

      await expect(page.getByText('book title', { exact: true })).toBeVisible()
      await expect(page.getByText('book author', { exact: true })).toBeVisible()
    })

    test('a blog can be liked', async ({ page}) => {
      await createBlog(page, 'book title', 'book author', 'book url')

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByTestId('blog-likes')).toHaveText('0')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByTestId('blog-likes')).toHaveText('1')
    })

    test('a blog can be deleted', async ({ page}) => {
      await createBlog(page, 'book title', 'book author', 'book url')

      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click();

      await expect(page.getByRole('button', { name: 'view' })).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'hide' })).not.toBeVisible()
    })
  })
})
