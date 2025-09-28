const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if (message.type ==='error') {
    return (
      <div className='error'>
        {message.context}
      </div>
    )
  }
  else return (
    <div className='message'>
      {message.context}
    </div>
  )
}

export default Notification