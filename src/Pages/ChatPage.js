import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('https://messaging-socket-app-be.vercel.app');

const ChatPage = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get('https://messaging-socket-app-be.vercel.app/api/v1/getmessages');
      setMessages(res.data);
    };

    fetchMessages();

    socket.on('message', (message) => {
      console.log(message)
      setMessages((prevMessages) => [message, ...prevMessages]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const decoded = JSON.parse(atob(token.split('.')[1]));
    console.log(decoded)
    const newMsg = {
      userId: decoded.user._id,
      username: decoded.user.username,
      content: newMessage,
    };

    try {
      await axios.post('https://messaging-socket-app-be.vercel.app/api/v1/sendMessage', newMsg, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl mb-4">Chat</h1>
        <div className="overflow-y-scroll h-64 mb-4">
          {messages.map((message) => (
            <div key={message._id} className="mb-2">
              <strong>{message.username}: </strong>
              <span>{message.content}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Type a message..."
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
