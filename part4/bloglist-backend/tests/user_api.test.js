const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User= require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  // await User.insertMany(helper.getAllUsers())
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'root',
    name: 'rr',
    passwordHash
  })

  await user.save()
})

describe('test add a user', async () => {
  test('add a new user and expect success', async () => {
    const usersAtStart = await helper.usersInDB()
    const newUser = {
      username: 'King',
      name: 'king',
      password: '1234'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })
  test('add a existing user and expect fail with proper status code return', async () => {
    const usersAtStart = await helper.usersInDB()
    const newUser = {
      username: 'root',
      name: 'king',
      password: '1234'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDB()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  test('add a new user with invalid username and expect fail', async () => {
    const usersAtStart = await helper.usersInDB()
    const newUser = {
      username: 'Ki',
      name: 'king',
      password: '1234'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDB()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  test('add a new user with invalid password and expect fail', async () => {
    const usersAtStart = await helper.usersInDB()
    const newUser = {
      username: 'Kinn',
      name: 'king',
      password: '14'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDB()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('user login and return proper status', async () => {
  test('login with existing user', async () => {
    const loginUser = {
      username: 'root',
      name: 'king',
      password: 'sekret'
    }
    await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
  })

  test('login with invalid user', async () => {
    const loginUser = {
      username: 'root',
      name: 'king',
      password: 'sekret1'
    }
    await api
      .post('/api/login')
      .send(loginUser)
      .expect(401)
  })
})

after(async () => {
  await mongoose.connection.close()
})