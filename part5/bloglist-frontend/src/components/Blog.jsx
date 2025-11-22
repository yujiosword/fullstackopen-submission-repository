import { useState } from 'react'

const Blog = ({ blog, handleLikes }) => {
  const [blogDetailVisible, setBlogDetailVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: blogDetailVisible ? '' : 'none' }
  const buttonLabel = blogDetailVisible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setBlogDetailVisible(!blogDetailVisible)
  }

  const addLikes = () => {
    handleLikes(blog)
  }

  return (
    <div style={blogStyle}>
      {blog.title} 
      <button onClick={toggleVisibility}>{buttonLabel}</button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={addLikes}>like</button>
        </div>
        <div>{blog.author}</div>
      </div>
    </div>  
  )
}

export default Blog