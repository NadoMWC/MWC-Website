import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer/footer.jsx'
import Dashboard from './components/dashboard/dashboard.jsx'
import Calendar from './components/calendar/calendar.jsx'
import Testing from './components/testing/testing.jsx'
import LoginPage from './pages/loginpage.jsx'
import ProtectedRoutes from './components/protectedroute/protectedroute.jsx'
import './App.css'

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <div>
        <Routes>
          <Route path='/login' element={<LoginPage/>} />
          <Route element={<ProtectedRoutes/>}>
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/calendar' element={<Calendar/>} />
            <Route path='/testing' element={<Testing/>} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App
