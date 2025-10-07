const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
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

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      { likes: request.body.likes },
      { new: true }
    )
  response.status(200).json(updatedBlog)
})

module.exports = blogRouter