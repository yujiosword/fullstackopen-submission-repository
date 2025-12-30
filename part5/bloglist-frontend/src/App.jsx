import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUserJSON')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      blogService.setToken(user.token)
      setMessage('')
      setUser(user)
      window.localStorage.setItem('loggedUserJSON', JSON.stringify(user))
    }
    catch {
      setTimeout(() => {
        setMessage('')
      }, 5000)
      setMessage('wrong username or password')
    }
  }

  const submitBlog = async (blogObject) => {
    const createdBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(createdBlog))
    setTimeout(() => {
      setMessage('')
    }, 5000)
    setMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    blogFormRef.current.toggleVisibility()
  }

  const addLikes = async (blogObject) => {
    const blogToUpdate = await blogService.get(blogObject)
    blogToUpdate.likes += 1
    delete blogToUpdate.user
    const updatedBlog = await blogService.update(blogToUpdate)
    const newBlogs = blogs.map(blog =>
      blog.id === blogObject.id
        ? updatedBlog
        : blog
    )
    newBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(newBlogs)
  }

  const removeBlog = async blogObject => {
    const deleteBlogId = blogObject.id
    const statusCode = await blogService.remove(blogObject)
    if (statusCode === 204) {
      console.log('delete success')
      const newBlogs = blogs.filter(blog => blog.id !== deleteBlogId)
      setBlogs(newBlogs)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUserJSON')
    setUser(null)
    setMessage('')
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification className='error' message={message}/>
      <LoginForm handleLogin={handleLogin} />
    </div>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification className='info' message={message} />
      <p>
        {user.username} logged in
        <button onClick={logout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={submitBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id}
          blog={blog}
          handleLikes={addLikes}
          handleRemove={removeBlog}
          username={blog.user.username}
        />
      )}
    </div>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && blogList()}
    </div>
  )
}

export default App