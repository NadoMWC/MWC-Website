import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the user is logged in and load from localStorage when the app initializes
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded); // Set the user state from the token
    }
  }, []);

  // Function to update user state (to be used in the login process)
  const login = (token) => {
    const decoded = jwtDecode(token);
    setUser(decoded);  // Set the decoded user data into the state
    localStorage.setItem('access_token', token);  // Store the token in localStorage
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
