import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ChatPage from './Pages/ChatPage';

const App = () => {
  const [token, setToken] = useState(null);

    useEffect(()=>{
      const token = localStorage.getItem("token")
      if(token){
        setToken(token)
      }
    },[])
    
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={token ? <ChatPage token={token} /> : <LoginPage setToken={setToken} />} />
      </Routes>
    </Router>
  );
};

export default App;
