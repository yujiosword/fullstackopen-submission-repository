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
  if (typeof(blog.title) === 'string' && typeof(blog.url) === 'string') {
    const newBlog= await blog.save()
    response.status(201).json(newBlog)
  }
  else response.status(400).end()
})

module.exports = blogRouter