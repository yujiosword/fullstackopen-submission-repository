import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls event handler it received as props', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog}/>)

  const inputTitle = container.querySelector('#title')
  const inputAuthor = container.querySelector('#author')
  const inputUrl = container.querySelector('#url')

  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'test title')
  await user.type(inputAuthor, 'test author')
  await user.type(inputUrl, 'test url')
  await user.click(sendButton)

  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('test url')
})