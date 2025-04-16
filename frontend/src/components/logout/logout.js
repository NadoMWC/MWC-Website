
export function logout(navigate, setUser) {
  navigate('/login');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  setUser(null);
}

export default logout;