export const Message = ({ message, className }) => {
  return (
    <div className={className}>
      <div>
        <h3 className="messageUserName">{message.userName}</h3>
        {message.content}
      </div>
    </div>
  );
};
