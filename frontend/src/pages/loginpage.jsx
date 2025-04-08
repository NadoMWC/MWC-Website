import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './loginpage.css'
import { useAuth } from '../context/AuthContext.jsx'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tokens = await axios.post('http://localhost:8000/login/token/', {username, password,});
      const { access, refresh } = tokens.data;

      // Store Tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      login(access);

      // Redirect to the protected page
      navigate('/dashboard');

      console.log('✅ Success:', tokens.data);
    } catch (err) {
      if (err.tokens) {
        console.log('❌ Error:', err.tokens.data.message);
      } else {
        console.error('⚠️ Request failed:', err.message);
      }
    }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <input
          type="test"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;


// DrewMaracle
// MWCwindows123
// drewmaracle12@gmail.com