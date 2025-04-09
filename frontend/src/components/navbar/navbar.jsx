import './navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import logout from '../logout/logout.js'


function Navbar () {

    const { setUser } = useAuth();
    const navigate = useNavigate();

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/testing">Testing</Link>
            <button onClick={() => logout(navigate, setUser)}>Logout</button>
        </nav>
    );
}

export default Navbar