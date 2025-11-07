import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
    }
  }, [])
  
  const handleLogin = async (event) => {
    event.preventDefault()
    const user = await loginService.login({ username, password })
    setUser(user)
    setUsername('')
    setPassword('')
    window.localStorage.setItem('loggedUserJSON', JSON.stringify(user))
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