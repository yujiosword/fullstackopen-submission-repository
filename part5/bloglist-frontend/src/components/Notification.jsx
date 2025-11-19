const Notification = ({ className, message }) => {
  let style
  const infoStyle = {
    color: 'green',
    fontSize: '20px'
  }
  const errorStyle = {
    color: 'red',
    fontSize: '20px'
  }
  className == 'error'
  ? style = errorStyle
  : style = infoStyle
  if (message) {
    return (
      <div style={style}>
        {message}
      </div>
    )
  }
}

export default Notification