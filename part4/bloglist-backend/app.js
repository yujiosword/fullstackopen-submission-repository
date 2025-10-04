const express = require('express')
const mongoose = require('mongoose')
const app = express()
const blogRouter = require('./controllers/blogs')
// const logger = require('./utils/logger')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI)

app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports = app