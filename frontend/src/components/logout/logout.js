
export function logout(navigate, setUser) {
  setUser(null);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  navigate('/login');
}

export default logout;