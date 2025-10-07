const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('test GET returns correct amount of blogs in JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifer property is id instead of _id', async () => {
  const response = await api.get('/api/blogs')
  // console.log('response.body', response.body)
  // console.log('Object.keys(response.body)', Object.keys(response.body[0]))
  assert(Object.keys(response.body[0]).includes('id'))
})

test('test POST can create a new blog post', async () => {
  const newBlog = {
    title: 'Test Post',
    author: 'Kin',
    url: 'https://hello.com/',
    likes: 2,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.getAllBlogs()
  // console.log('blogsAtEnd', blogsAtEnd)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

test('if the likes property is missing, default to value 0', async () => {
  const newBlog = {
    title: 'Test default likes value',
    author: 'Kin2',
    url: 'https://hello.com/',
  }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  // console.log('response', response.body)
  assert.strictEqual(response.body.likes, 0)
})

describe('return 400 Bad Request if missing title/url', () => {
  test('title', async () => {
    const newBlog = {
      author: 'Kin3',
      url: 'https://hello.com/',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('url', async () => {
    const newBlog = {
      title: 'Test default likes value',
      author: 'Kin4',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

test('delete a blog post when given a valid id', async () => {
  const blogsAtStart = await helper.getAllBlogs()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.getAllBlogs()

  assert(!blogsAtEnd.some(blog => blog.id === blogToDelete.id))
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('update likes number of a post when given a valid id', async () => {
  const blogsAtStart = await helper.getAllBlogs()
  const blogToUpdate = structuredClone(blogsAtStart[0])

  blogToUpdate.likes += 1

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)

  assert.strictEqual(response.body.likes, blogsAtStart[0].likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})