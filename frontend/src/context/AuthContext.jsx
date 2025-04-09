import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // If logged in, check token from local storage to set state for user info
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);}}, []);

  // If fresh login, decode token to set state for user info
  const login = (token) => {
    const decoded = jwtDecode(token);
    setUser(decoded);};

  return (
    <AuthContext.Provider value={{ user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
