const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

const initialBlogsWithRootUser = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const rootUser = new User({ username: 'root', passwordHash })
  const savedUser = await rootUser.save()
  await Blog.deleteMany({})
  for (const blog of initialBlogs){
    const newBlog = new Blog({ ...blog, user: savedUser._id })
    const savedBlog = await newBlog.save()
    savedUser.blogs = savedUser.blogs.concat(savedBlog)
  }
  await savedUser.save()
}

const initialUserWithoutBlogs = async () => {
  const user = new User({
    username: 'Kin',
    name: 'kin',
    password: '1234',
  })
  await user.save()
}

const getAllBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const generateTokenForUser = async (username) => {
  const user = await User.findOne({ username })
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  return jwt.sign(userForToken, process.env.SECRET)
}

module.exports = { initialBlogs, initialUserWithoutBlogs, initialBlogsWithRootUser, getAllBlogs, usersInDB, generateTokenForUser }