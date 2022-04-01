import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from './auth_context';
import { io } from 'socket.io-client';

export const useMessages = (chatRoom) => {
  // useState causes a re-render
  const [messages, setMessages] = useState([]);
  // useRef doesn't change on re-renders
  const messagesRef = useRef([]);
  const [socket, setSocket] = useState(null);
  const [authToken] = useContext(AuthContext);

  useEffect(() => {
    if (chatRoom) {
      console.log(chatRoom.id);
      const socket = io({
        auth: {
          token: authToken,
        },
        query: {
          chatRoomId: chatRoom.id,
        },
      });

      setSocket(socket);
      // load new messages event listener
      socket.on('message', (message) => {
        console.log(messages);
        messagesRef.current.push(message);
        setMessages([...messagesRef.current]);
        // setMessages([messages, ...message]); // why doesn't this work?
      });
      // load initial messages event listener
      socket.on('initial-messages', (messages) => {
        console.log(messages);
        messagesRef.current = messages;
        setMessages(messages);
      });
      return () => {
        socket.off('message');
        socket.off('initial-messages');
        socket.disconnect();
      };
    }
    return () => {};
  }, [chatRoom]);

  const sendMessage = (content, user) => {
    // goes to message function in messages.gateway.ts
    socket.emit('message', {
      content,
      userName: `${user.firstName} ${user.lastName}`,
    });
  };

  return [messages, sendMessage];
};
