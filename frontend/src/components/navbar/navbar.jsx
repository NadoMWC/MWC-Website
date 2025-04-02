import './navbar.css'
import { Link } from 'react-router-dom';



function Navbar () {

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/testing">Testing</Link>
        </nav>
    );

}

export default Navbar