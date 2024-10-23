const Message = ({ message, classMessage }) => {
    if (!message) {
      return null
    }
    return <div className={classMessage}>{message}</div>
  }
  
  export default Message
  