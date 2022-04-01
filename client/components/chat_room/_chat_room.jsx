import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';
import { useNavigate } from 'react-router';

import { useMessages } from '../../utils/use_messages';
import { Message } from './message';

export const ChatRoom = () => {
  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const { id } = useParams();

  const navigate = useNavigate();

  const [chatRoom, setChatRoom] = useState(null);
  const [newMessageContent, setnewMessageContent] = useState('');
  const [messages, sendMessage] = useMessages(chatRoom);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(async () => {
    const { user } = await api.get('/users/me');
    setUser(user);
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
  }, []);

  return (
    <div className="chatRoomBackground">
      <button className="px-5 py-3 bg-blue-700 text-white ml-5 rounded absolute" onClick={() => navigate('/')}>
        Back
      </button>
      <div className="chatArea">
        <h2>{chatRoom && chatRoom.name}</h2>
        <div className="messageArea">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              className={message.userId == user.id ? 'sentMessage' : 'recievedMessage'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="messageInputArea">
          <input type="text" value={newMessageContent} onChange={(e) => setnewMessageContent(e.target.value)} />
          <button
            onClick={() => {
              newMessageContent !== '' ? sendMessage(newMessageContent, user) : null;
              setnewMessageContent('');
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
