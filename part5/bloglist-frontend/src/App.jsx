import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
  
  const handleLogin = async (event) => {
    event.preventDefault()
    const user = await loginService.login({ username, password })
    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
    window.localStorage.setItem('loggedUserJSON', JSON.stringify(user))
  }

  const submitBlog = async (event) => {
    event.preventDefault()
    const newBlog = { title, author, url }
    const createdBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(createdBlog))
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUserJSON')
    setUser(null)
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input 
                type='text' 
                value={username} 
                onChange={({target}) => setUsername(target.value)}/>
            </label>
          </div>
          <div>
            <label>
              password
              <input 
                type='text' 
                value={password} 
                onChange={({target}) => setPassword(target.value)}/>
            </label>
          </div>
          <button type="submit">login</button>
        </form>
    </div>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.username} logged in
        <button type='button' onClick={logout}>
          logout
        </button>
      </p>
      <h2>create new</h2>
        <form onSubmit={submitBlog}>
          <div>
            <label>
              title:
              <input 
                type='text' 
                value={title} 
                onChange={({target}) => setTitle(target.value)}/>
            </label>
          </div>
          <div>
            <label>
              author:
              <input 
                type='text' 
                value={author} 
                onChange={({target}) => setAuthor(target.value)}/>
            </label>
          </div>
          <div>
            <label>
              url:
              <input 
                type='text' 
                value={url} 
                onChange={({target}) => setUrl(target.value)}/>
            </label>
          </div>
          <button type="submit">create</button>
        </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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