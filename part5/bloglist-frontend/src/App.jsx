import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notificaiton = ({ className, message }) => {
  let style
  const infoStyle = {
    color: 'green',
    fontSize: '20px'
  }
  const errorStyle = {
    color: 'red',
    fontSize: '20px'
  }
  className == 'error'
  ? style = errorStyle
  : style = infoStyle
  if (message) {
    return (
      <div style={style}>
        {message}
      </div>
    )
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

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
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setMessage('')
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedUserJSON', JSON.stringify(user))
    }
    catch {
      setTimeout(() => {
        setMessage('')
      }, 5000)
      setMessage('wrong username or password')
    }
  }

  const submitBlog = async (event) => {
    event.preventDefault()
    const newBlog = { title, author, url }
    const createdBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(createdBlog))
    setTimeout(() => {
      setMessage('')
    }, 5000)
    setMessage(`a new blog ${title} by ${author} added`)
    toggleVisibility()
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUserJSON')
    setUser(null)
    setMessage('')
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notificaiton className='error' message={message}/>
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
      <Notificaiton className='info' message={message} />
      <p>
        {user.username} logged in
        <button type='button' onClick={logout}>
          logout
        </button>
      </p>
      <div style={hideWhenVisible}>
        <button type='button' onClick={toggleVisibility} >
            create new blog
        </button>
      </div>
      <div style={showWhenVisible}>
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
        <button type='button' onClick={toggleVisibility} >
            cancel
        </button>
      </div>
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