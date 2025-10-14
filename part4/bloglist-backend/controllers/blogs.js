const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) return response.status(401).json({ error: 'token invalid' })

  if (typeof(body.title) === 'undefined' || typeof(body.url) === 'undefined') {
    return response.status(400).json({ error: 'title or url undefined' })
  }

  const user = await User.findById(decodedToken.id ?? '68ecfd4ac36a71d09fadc016')
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    ...body,
    likes: body.likes ?? 0,
    user: user._id
  })

  const savedBlog= await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

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