import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer/footer.jsx'
import Dashboard from './components/dashboard/dashboard.jsx'
import Calendar from './components/calendar/calendar.jsx'
import Testing from './components/testing/testing.jsx'
import './App.css'

function App() {

  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/testing' element={<Testing />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App
