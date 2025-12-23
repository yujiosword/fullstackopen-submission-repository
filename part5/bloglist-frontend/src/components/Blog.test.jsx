import { render, screen } from '@testing-library/react'
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
})
