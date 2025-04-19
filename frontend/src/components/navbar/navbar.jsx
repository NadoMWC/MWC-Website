import './navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import logout from '../logout/logout.js'
import { useRef, useEffect, useState } from 'react';


function Navbar () {
    const [hideNavbar, setHideNavbar] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    return (
        <div className='navbar'>
            <button 
                className={`show-navbar-button ${hideNavbar ? 'up' : ''}`} 
                onClick={() => setHideNavbar(prev => !prev)}
            >
                {hideNavbar ? '⬇️' : '⬆️'}
            </button>
            
            <nav className='navlinks'>
                <Link to="/dashboard" className='dash-link'>Dashboard</Link>
                <Link to="/calendar" className='dash-link'>Calendar</Link>
                <Link to="/testing" className='dash-link'>Testing</Link>
                <button 
                    className='navbar-logout-button' 
                    onClick={() => logout(navigate, setUser)}
                >
                    Logout
                </button>
            </nav>
        </div>
    );
};


export default Navbar;



// function Navbar () {

//     const [hideNavbar, setHideNavbar] = useState(false)


//     const { setUser } = useAuth();
//     const navigate = useNavigate();

//     return (
//         <nav className={`navbar ${hideNavbar ? 'hidden' : 'shown'}`}>
//             <Link to="/dashboard" className='dash-link'>Dashboard</Link>
//             <Link to="/calendar" className='dash-link'>Calendar</Link>
//             <Link to="/testing" className='dash-link'>Testing</Link>
//             <button className='navbar-logout-button' onClick={() => logout(navigate, setUser)}>Logout</button>

//             <button className='show-navbar-button' onClick={() => setHideNavbar(prev => !prev)}>
//                 {hideNavbar ? '⬆️' : '⬇️'}
//             </button>
//         </nav>
//     );
// }

// export default Navbar