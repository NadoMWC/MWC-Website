import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'
import axios from 'axios';
import MWC_Image from './login_mwc_image.png'
import './loginpage.css'

const LoginPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState(false)

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check If User is Authenticated/Return Tokens
      const tokens = await axios.post('http://localhost:8000/login/token/', {username, password,});
      const { access, refresh } = tokens.data;

      localStorage.setItem('access_token', access);  // STORE ACCESS TOKEN
      localStorage.setItem('refresh_token', refresh);  // STORE REFRESH TOKEN
      login(access);  // STORE USER LOGIN INFO IN STATE FOR PERMISSIONS
      navigate('/dashboard');
      setLoginErrorMessage(false);
    }

    catch (err) {
      setLoginErrorMessage(true);
      if (err.tokens) {
        console.log('❌ Error:', err.tokens.data.message);
      } 
      else {
        console.error('⚠️ Request failed:', err.message);
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form-login-container">
        <img src={MWC_Image} alt="MWC_Logo" className="login-mwc-image" />
        <div className="welcome-message">Web App</div>
        
        <input
          className='login-username-field'
          type="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required/>

        <input
          className='login-password-field'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required/>

        <button
          className='login-button'
          type="submit">
          Login</button>

        {loginErrorMessage && (
          <div className='login-error'>
            *Login Error* - Try again or contact Drew 
          </div>
          )
        }

      </form>
    </div>
  );
};

export default LoginPage;