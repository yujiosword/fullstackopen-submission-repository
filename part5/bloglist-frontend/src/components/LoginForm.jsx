import { useState } from "react"

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const userLogin = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={userLogin}>
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
  )
}
export default LoginForm