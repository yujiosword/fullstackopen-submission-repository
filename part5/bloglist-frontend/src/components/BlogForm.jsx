import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const submitBlog = async (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submitBlog}>
        <div>
          <label htmlFor="title">
            title:
            <input
              id="title"
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}/>
          </label>
        </div>
        <div>
          <label htmlFor="author">
            author:
            <input
              id='author'
              type='text'
              value={author}
              onChange={({ target }) => setAuthor(target.value)}/>
          </label>
        </div>
        <div>
          <label htmlFor="url">
            url:
            <input
              id="url"
              type='text'
              value={url}
              onChange={({ target }) => setUrl(target.value)}/>
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm