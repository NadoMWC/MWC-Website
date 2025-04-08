import './navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';



function Navbar () {
    const { setUser } = useAuth();

    // Logout and Clear Tokens
    const navigate = useNavigate();
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/testing">Testing</Link>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );

}

export default Navbar