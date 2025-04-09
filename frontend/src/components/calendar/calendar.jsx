import './calendar.css'
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './eventmodal';
import axiosInstance from '../../api/axiosInstance.js';
import { useAuth } from '../../context/AuthContext.jsx'


function Calendar() {
  // States
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal Open/Hidden
  const [isModalLocked, setIsModalLocked] = useState(false); // Prevent Immediate Close
  const [lockTimeout, setLockTimeout] = useState(null); // Prevent Immediate Close
  const [eventsForDate, setEventsForDate] = useState([]); // Stores events info for date clicked
  const [clickedDate, setClickedDate] = useState([]) // Date clicked
  const [events, setEvents] = useState([]); // Events loaded into calendar

  // Fetch events from the API when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('access_token');

      try {
        const response = await axiosInstance.get('http://127.0.0.1:8000/api/calendar/view_events/', 
          {headers: {'Authorization': `Bearer ${token}`}});

        // Map the events to FullCalendar's format
        const calendarEvents = response.data.map(event => ({
          id: event.id,
          title: event.name,
          start: event.date,
          cost: event.cost,
          description: event.notes,
          address: event.address,
          phone: event.phone,
          email: event.email,
          time: event.time,
          color: event.color}));

        setEvents(calendarEvents);}

        catch (error) {console.error("Error fetching events:", error);}}; 
        fetchEvents();}, []);

  const calendarClick = (info) => {
    
    const clickedDay = info.dateStr;
    const filteredEvents = events.filter(event => event.start === clickedDay);
    
    // Update States on Click
    setIsModalOpen(true);
    setIsModalLocked(true);

    // Store State Data
    setEventsForDate(filteredEvents);
    setClickedDate(clickedDay)
    
    // Prevent Modal Closing for .5 Seconds
    if (lockTimeout) clearTimeout(lockTimeout); 
    const timeoutId = setTimeout(() => {setIsModalLocked(false);}, 500); 
    setLockTimeout(timeoutId); 
  };

  const closeModal = () => {
    if (isModalLocked) 
    return; setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    const modalContent = e.target.closest('.modal-content');
    if (!modalContent) {closeModal();}
  };

  return (
    <div>

      {/* Render in the Calendar from FullCalendarJS */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={calendarClick}
        dateClick={calendarClick}/>

      {/* Conditionally render the EventModal */}
      {isModalOpen && (
        <EventModal 
            closeModal={closeModal} 
            handleOverlayClick={handleOverlayClick}
            events={eventsForDate}
            date={clickedDate}/>)}
            
    </div>
  );
};

export default Calendar;