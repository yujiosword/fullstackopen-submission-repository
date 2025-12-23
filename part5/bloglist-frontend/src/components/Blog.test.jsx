import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, describe } from 'vitest'

describe('<Blog/ >', () => {
  beforeEach(() => {
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
  })

  test('blog renders title/author and not render URL/likes', () => {
    const elementTitleAuthor = screen.getByText('test title test author')
    expect(elementTitleAuthor).toBeDefined()

    const elementURL = screen.getByText('test url')
    expect(elementURL).not.toBeVisible()

    const elementLikes = screen.getByText('likes')
    expect(elementLikes).not.toBeVisible()

  })

  test('blog URL/likes are shown when button clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const elementURL = screen.getByText('test url')
    expect(elementURL).toBeVisible()

    const elementLikes = screen.getByText('likes')
    expect(elementLikes).toBeVisible()
  })
})
