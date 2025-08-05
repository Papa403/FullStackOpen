const Notification = ({ message, status }) => {
  let className = 'notification '
  if (status) {
    className += status
  }
  if (!message) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification