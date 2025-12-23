import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { describe } from 'vitest'

describe('<Blog/ >', () => {
  test('blog renders title/author and not render URL/likes', () => {
    const blog = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
      user: {
        username: 'test username1'
      }
    }
    const username = 'test username1'

    render(<Blog blog={blog} username={username} />)

    const elementTitleAuthor = screen.getByText('test title test author')
    expect(elementTitleAuthor).toBeDefined()

    const elementURL = screen.getByText('test url')
    expect(elementURL).not.toBeVisible()

    const elementLikes = screen.getByText('likes')
    expect(elementLikes).not.toBeVisible()

  })

  test('blog URL/likes are shown when button clicked', async () => {
    const blog = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
      user: {
        username: 'test username1'
      }
    }
    const username = 'test username1'

    render(<Blog blog={blog} username={username}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const elementURL = screen.getByText('test url')
    expect(elementURL).toBeVisible()

    const elementLikes = screen.getByText('likes')
    expect(elementLikes).toBeVisible()
  })

  test('like button clicked twice cause the handler to call twice', async () => {
    const blog = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
      user: {
        username: 'test username1'
      }
    }
    const mockHandler = vi.fn()
    const username = 'test username1'

    render(<Blog blog={blog} username={username} handleLikes={mockHandler}/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
