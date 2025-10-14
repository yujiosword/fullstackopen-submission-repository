const express = require('express')
const mongoose = require('mongoose')
const app = express()
const loginRouter = require('./controllers/login')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
// const logger = require('./utils/logger')

const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI)

app.use(express.json())

app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/blogs', blogRouter)

app.use(middleware.errorHandler)

module.exports = app