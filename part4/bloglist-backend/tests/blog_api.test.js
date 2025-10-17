const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
// const Blog = require('../models/blog')
const User= require('../models/user')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const api = supertest(app)

beforeEach(async () => {
  await helper.initialBlogsWithRootUser()
  await helper.initialUserWithoutBlogs()
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
  assert(Object.keys(response.body[0]).includes('id'))
})

test('POST request requires correct auth token', async () => {
  const user = await User.findOne({ username: 'root' })
  const token = await helper.generateTokenForUser(user.username)
  const newBlog = {
    title: 'Test Post',
    author: 'Kin',
    url: 'https://hello.com/',
    likes: 2,
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.getAllBlogs()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert.strictEqual(user._id.toString(), response.body.user)
})

test('POST will return 401 if missing auth', async () => {
  const user = await User.findOne({ username: 'root' })
  const newBlog = {
    title: 'Test Post',
    author: 'Kin',
    url: 'https://hello.com/',
    likes: 2,
    user: user._id,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('if the likes property is missing, default to value 0', async () => {
  const user = await User.findOne({ username: 'root' })
  const token = await helper.generateTokenForUser(user.username)
  const newBlog = {
    title: 'Test default likes value',
    author: 'Kin2',
    url: 'https://hello.com/',
    user: user._id,
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)

  assert.strictEqual(response.body.likes, 0)
})

describe('return 400 Bad Request if missing title/url', () => {
  test('title', async () => {
    const user = await User.findOne({ username: 'root' })
    const token = await helper.generateTokenForUser(user.username)
    const newBlog = {
      author: 'Kin3',
      url: 'https://hello.com/',
      user: user._id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('url', async () => {
    const user = await User.findOne({ username: 'root' })
    const token = await helper.generateTokenForUser(user.username)
    const newBlog = {
      title: 'Test default likes value',
      author: 'Kin4',
      user: user._id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('delete a blog', async () => {
  test('valid id and valid token', async () => {
    const blogsAtStart = await helper.getAllBlogs()
    const blogToDelete = blogsAtStart[0]
    const user = await User.findById(blogToDelete.user)
    const token = await helper.generateTokenForUser(user.username)
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.getAllBlogs()

    assert(!blogsAtEnd.some(blog => blog.id === blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('valid id but invalid token', async () => {
    const blogsAtStart = await helper.getAllBlogs()
    const blogToDelete = blogsAtStart[0]
    const user = await User.findOne({ username: 'Kin' })
    const token = await helper.generateTokenForUser(user.username)
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    const blogsAtEnd = await helper.getAllBlogs()

    assert(blogsAtEnd.some(blog => blog.id === blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
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