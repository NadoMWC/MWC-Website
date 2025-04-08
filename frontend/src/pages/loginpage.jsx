import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'
import axiosInstance from '../api/axiosInstance.js'
import './loginpage.css'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Call useAuth Hook to use for login to store user state
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tokens = await axiosInstance.post('http://localhost:8000/login/token/', {username, password,});
      const { access, refresh } = tokens.data;

      localStorage.setItem('access_token', access);  // STORE ACCESS TOKEN
      localStorage.setItem('refresh_token', refresh);  // STORE REFRESH TOKEN

      login(access);  // STORE USER LOGIN INFO IN STATE FOR PERMISSIONS
      navigate('/dashboard');

      console.log('✅ Success:', tokens.data);} 
      catch (err) 
        {if (err.tokens) 
            {console.log('❌ Error:', err.tokens.data.message);} 
          else {console.error('⚠️ Request failed:', err.message);}}
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <input
          type="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required/>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          Login</button>

      </form>
    </div>
  );
};

export default LoginPage;