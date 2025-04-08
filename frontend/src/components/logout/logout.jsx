// LogoutButton.jsx
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens (or anything else you've stored)
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Redirect to login
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;