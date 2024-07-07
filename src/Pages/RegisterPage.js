import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/v1/users/sign-up', { email , username, password });
      alert('User registered');
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl mb-4">Register</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
