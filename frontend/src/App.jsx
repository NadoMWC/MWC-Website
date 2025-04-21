import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer/footer.jsx'
import Dashboard from './components/dashboard/dashboard.jsx'
import MyCalendar from './components/calendar/calendar.jsx'
import Testing from './components/testing/testing.jsx'
import LoginPage from './pages/loginpage.jsx'
import ProtectedRoutes from './components/protectedroute/protectedroute.jsx'

function App() {
  const hideComponent = ['/login'].includes(useLocation().pathname);

  return (
    <div>
      {/* {!hideComponent && <Navbar />} */}
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path='/login' element={<LoginPage/>} />
            <Route element={<ProtectedRoutes/>}>
              <Route path='/dashboard' element={<Dashboard/>} />
              <Route path='/calendar' element={<MyCalendar/>} />
              <Route path='/testing' element={<Testing/>} />
            </Route>
          </Routes>
        </div>
    </div>
  );
};

export default App
