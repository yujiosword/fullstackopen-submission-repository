const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs)
  // })
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog({ ...request.body, likes: request.body.likes ?? 0 })
  if (typeof(blog.title) === 'undefined' || typeof(blog.url) === 'undefined') {
    response.status(400).end()
  }
  else {
    const newBlog= await blog.save()
    response.status(201).json(newBlog)
  }
})

module.exports = blogRouter