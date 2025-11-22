import { useState } from 'react'

const Blog = ({ blog, handleLikes, username, handleRemove }) => {
  const [blogDetailVisible, setBlogDetailVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: blogDetailVisible ? '' : 'none' }
  const showRemoveButton = { 
    display: 
      username === blog.user.username 
      ? '' 
      : 'none' 
  }
  const buttonLabel = blogDetailVisible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setBlogDetailVisible(!blogDetailVisible)
  }

  const addLikes = () => {
    handleLikes(blog)
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleRemove(blog)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{buttonLabel}</button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={addLikes}>like</button>
        </div>
        <div>{username}</div>
        <div style={showRemoveButton}><button onClick={removeBlog}>remove</button></div>
      </div>
    </div>  
  )
}

export default Blog