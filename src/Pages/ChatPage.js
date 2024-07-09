import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8080');

const ChatPage = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get('http://localhost:8080/api/v1/getmessages');
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
      socket.connect();

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
      await axios.post('http://localhost:8080/api/v1/sendMessage', newMsg, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto">
        <button onClick={()=> {
          localStorage.clear();
          socket.disconnect();
          window.location.href = '/';
        }} className='m-5 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'> Logout </button>

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
